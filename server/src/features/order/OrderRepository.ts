import { Order, Vehicle, VehicleSchedule, DriverVehicleAssignment, sequelize } from '../models';
import { Op } from 'sequelize';
import { EditOrderRequest } from './orderRequests';

export async function getAllOrdersDB(filters: { date?: string; destination?: string; sort?: string; order?: 'ASC' | 'DESC'; status?: string }) {
    const whereClause: Record<string, any> = {};

    if (filters.status) whereClause.status = filters.status;
    if (filters.date) {
        const dateStart = new Date(filters.date);
        const dateEnd = new Date(filters.date);

        dateStart.setHours(0, 0, 0, 0);
        dateEnd.setHours(23, 59, 59, 999);

        whereClause.date = { [Op.between]: [dateStart, dateEnd] };
    }

    if (filters.destination) whereClause.destination = { [Op.like]: `%${filters.destination.toLowerCase()}%` };
    
    const orders = await Order.findAll({
        where: whereClause,
        order: filters.sort ? [[filters.sort, filters.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']] : undefined,
        include: [
            {
                model: VehicleSchedule,
                as: 'vehicleSchedule',
                required: false,
                include: [
                    {
                        model: Vehicle,
                        as: 'vehicle',
                        required: false,
                    },
                ],
            },
        ],
    });

    return orders.map(order => order.get({ plain: true }))
}

export async function createOrderDB(orderData: any, orderUUID: string) {
    return await Order.create({ ...orderData, orderUUID });
}

export async function findOrderByUUID(orderUUID: string, t?: any) {
    return await Order.findOne({ where: { orderUUID }, transaction: t });
}

export async function findVehicleByPlate(vehiclePlate: string, t?: any) {
    return await Vehicle.findOne({ where: { vehiclePlate }, transaction: t });
}

export async function findDriverAssignment(vehicleId: number, t?: any) {
    return await DriverVehicleAssignment.findOne({
        where: { vehicleId, unassignedAt: null },
        transaction: t,
    });
}

export async function findVehicleSchedule(vehicleId: number, date: string, t?: any) {
    return await VehicleSchedule.findOne({ where: { vehicleId, date }, transaction: t });
}

export async function getOrderTotalWeight(vehicleScheduleId: number, transaction?: any) {
    return await Order.findOne({
        where: { vehicleScheduleId, status: 'assigned' },
        attributes: [[sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight']],
        transaction
    });
}

export async function getOrderById(orderID: number) {
    return await Order.findOne({
        where: { id: orderID },
    });
}

export async function updateOrder(id: number, updatedOrder: EditOrderRequest) {
    const [affectedRows] = await Order.update(updatedOrder, {
        where: { id },
    });
    if (affectedRows === 0) {
        throw new Error('Order not found or update failed');
    }

    return true;
}

