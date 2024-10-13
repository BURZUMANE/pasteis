import { v4 as uuidv4 } from 'uuid';
import { Order, sequelize, VehicleSchedule } from '../models';
import {
  createOrderDB,
  findDriverAssignment,
  findOrderByUUID,
  findVehicleByPlate,
  findVehicleSchedule,
  getAllOrdersDB,
  getOrderById,
  getOrderTotalWeight,
  updateOrder
} from './OrderRepository';
import { io } from '../../server';
import { ConflictError } from '../../common/errors';
import logger from '../../common/logger';
import { userSocketMap } from '../../services/socketService';
import { EditOrderRequest } from './orderRequests';

export async function getOrders(filters: { date?: string; destination?: string; sort?: string; order?: 'ASC' | 'DESC'; status?: string }) {
  return await getAllOrdersDB(filters);
}

export async function createOrder(orderData: any) {
  return await createOrderDB(orderData, generateOrderID());
}

export async function completeOrder(orderUUID: string) {
  const order = await findOrderByUUID(orderUUID);
  if (!order) return;
  order.status = 'delivered';
  await order.save();
  io.to('managers').emit('orderCompleted', { orderUUID });
}

export async function sortOrdersByDistance(vehiclePlate: string) {
  const vehicle = await findVehicleByPlate(vehiclePlate);
  if (!vehicle) return [];
  const assignedOrders = await Order.findAll({ where: { vehicleId: vehicle.id, status: 'assigned' } });
  return assignedOrders
    .map(order => ({
      ...order.get({ plain: true }),
      distance: calculateDistance(38.71814, -9.14552, order.lat, order.lon),
    }))
    .sort((a, b) => a.distance - b.distance);
}

export async function assignOrderToVehicle(orderUUID: string, vehiclePlate: string) {
  return sequelize.transaction(async (t) => {
    const order = await findOrderByUUID(orderUUID, t);
    if (!order) throw new Error('Order not available for assignment or is already assigned');

    const vehicle = await findVehicleByPlate(vehiclePlate, t);
    if (!vehicle) throw new Error('Vehicle not found');

    let schedule = await findVehicleSchedule(vehicle.id, order.date.toISOString(), t);
    if (!schedule) {
      schedule = await VehicleSchedule.create({ vehicleId: vehicle.id, date: order.date }, { transaction: t });
    }

    const totalAssignedWeight = await getOrderTotalWeight(schedule.id, t);
    const { totalWeight } = totalAssignedWeight.get({ plain: true })
    const availableCapacity = vehicle.maxCapacity - totalWeight

    if (availableCapacity < order.weight) {
      throw new ConflictError('Not enough capacity on the scheduled day');
    }

    order.vehicleScheduleId = schedule.id;
    order.status = 'assigned';
    await order.save({ transaction: t });

    const driverAssignment = await findDriverAssignment(vehicle.id, t);
    if (driverAssignment) {
      const userId = driverAssignment.userId;

      const driverSocketId = userSocketMap.get(userId);
      if (driverSocketId) {
        io.to(driverSocketId).emit('orderAssigned', { orderUUID });
        logger.info(`Order ${orderUUID} assigned to driver with vehicle ${vehicle.vehiclePlate}`);
      } else {
        logger.warn(`Driver with vehicle plate ${vehicle.vehiclePlate} is not connected`);
      }
    }


    return {
      message: 'Order assigned successfully',
      order,
      updatedSchedule: schedule,
    };
  });
}

export async function editOrder(orderDTO: EditOrderRequest) {
  const didUpdate = await updateOrder(orderDTO.id, orderDTO);
  if (!didUpdate) {
    throw new ConflictError('Order did not update');
  }

  return { success: 'true', order: didUpdate };
}


function generateOrderID(): string {
  return `ORD-${uuidv4()}`;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
