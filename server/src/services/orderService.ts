import { sequelize, Order, Vehicle, VehicleSchedule, DriverVehicleAssignment } from '../models';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../server';
import { HttpError, NotFoundError } from 'routing-controllers';
import { userSocketMap } from './socketService';
import logger from '../utils/logger';

function generateOrderID(): string {
  return `ORD-${uuidv4()}`;
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getAllOrders(filters: { date?: string; destination?: string; sort?: string; order?: 'ASC' | 'DESC'; status?: string }) {
  const whereClause: Record<string, any> = {};

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.date) {
    const dateStart = new Date(filters.date);
    const dateEnd = new Date(filters.date);
    dateEnd.setDate(dateEnd.getDate() + 1);
    whereClause.date = {
      [Op.between]: [dateStart, dateEnd],
    };
  }

  if (filters.destination) {
    whereClause.destination = {
      [Op.like]: `%${filters.destination.toLowerCase()}%`,
    };
  }

  try {
    const queryOptions: any = {
      where: whereClause,
      raw: true,
      order: filters.sort ? [[filters.sort, filters.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']] : undefined,
    };

    const orders = await Order.findAll(queryOptions);
    return orders;
  } catch (error) {
    throw new Error("Error retrieving orders from the database");
  }
}

export async function createOrder(orderData: any) {
  try {
    const newOrder = await Order.create({ ...orderData, orderUUID: generateOrderID() });
    return newOrder;
  } catch (error: any) {
    throw new Error(error.errors.map((e: any) => e.message).join(', '));
  }
}

export async function completeOrder(orderUUID: string) {
  const order = await Order.findOne({ where: { orderUUID } });
  if (!order) return;

  order.status = 'delivered';
  await order.save();
  io.to('managers').emit('orderCompleted', { orderUUID });
}

export async function sortOrdersByDistance(vehiclePlate: string) {
  const vehicle = await Vehicle.findOne({ where: { vehiclePlate } });
  if (!vehicle) return [];

  const assignedOrders = await Order.findAll({ where: { vehicleId: vehicle.id, status: 'assigned' } });

  const sortedOrders = assignedOrders.map(order => ({
    ...order.get({ plain: true }),
    distance: calculateDistance(38.71814, -9.14552, order.lat, order.lon),
  })).sort((a, b) => a.distance - b.distance);

  return sortedOrders;
}

export async function assignOrderToVehicleForOrderDate(orderUUID: string, vehiclePlate: string) {
  return sequelize.transaction(async (t) => {
    const order = await Order.findOne({
      where: { orderUUID, status: 'unassigned' },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) {
      throw new NotFoundError('Order not available for assignment or is already assigned');
    }

    const vehicle = await Vehicle.findOne({
      where: { vehiclePlate },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    // Fetch the assigned driver by vehicleId
    const driverAssignment = await DriverVehicleAssignment.findOne({
      where: { vehicleId: vehicle.id, unassignedAt: null },  // Looking for the current assignment
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!driverAssignment) {
      throw new NotFoundError('No driver is currently assigned to this vehicle');
    }

    const userId = driverAssignment.userId; // Get the userId of the assigned driver

    let schedule = await VehicleSchedule.findOne({
      where: { vehicleId: vehicle.id, date: order.date },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!schedule) {
      schedule = await VehicleSchedule.create({
        vehicleId: vehicle.id,
        date: order.date,
      }, { transaction: t });
    }

    const result = await Order.findOne({
      where: { vehicleScheduleId: schedule.id, status: 'assigned' },
      attributes: [[sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight']],
      transaction: t,
    });

    const totalAssignedWeight = result?.dataValues?.totalWeight || 0;
    const availableCapacity = vehicle.maxCapacity - totalAssignedWeight;

    if (availableCapacity < order.weight) {
      throw new ConflictError('Not enough capacity on the scheduled day');
    }

    order.vehicleScheduleId = schedule.id;
    order.status = 'assigned';
    await order.save({ transaction: t });

    const driverSocketId = userSocketMap.get(userId); // Use the retrieved userId
    if (driverSocketId) {
      io.to(driverSocketId).emit('orderAssigned', { orderUUID });
      logger.info(`Order ${orderUUID} assigned to driver with vehicle ${vehicle.vehiclePlate}`);
    } else {
      logger.warn(`Driver with vehicle plate ${vehicle.vehiclePlate} is not connected`);
    }

    return {
      message: 'Order assigned successfully',
      order,
      updatedSchedule: schedule,
    };
  });
}
