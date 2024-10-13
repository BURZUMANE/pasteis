import { Vehicle, VehicleSchedule, Order } from "../models";

export const findVehicleWithSchedules = async (vehiclePlate: string, scheduleDate: string) => {
    return await Vehicle.findOne({
        where: { vehiclePlate },
        include: [
            {
                where: { date: scheduleDate },
                model: VehicleSchedule,
                as: 'schedules',
                required: false,
                include: [
                    {
                        model: Order,
                        as: 'orders',
                    }
                ]
            }
        ]
    });
};
