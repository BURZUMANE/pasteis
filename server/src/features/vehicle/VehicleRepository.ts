import { Vehicle, UserFavoriteVehicle, VehicleSchedule, Order } from '../models';

export const findAllVehicles = async (vehicleFilter: any, scheduleFilter: any) => {
  return await Vehicle.findAll({
    where: vehicleFilter,
    include: [
      {
        where: scheduleFilter,
        model: VehicleSchedule,
        as: 'schedules',
        required: false,
        include: [
          {
            model: Order,
            as: 'orders',
          },
        ],
      },
    ],
  });
};

export const findUserFavoriteVehicles = async (userId: number) => {
  return await UserFavoriteVehicle.findAll({
    where: { userId },
    attributes: ['vehicleId'],
  });
};

export const createVehicle = async (vehicleData: any) => {
  return await Vehicle.create(vehicleData);
};

export const findFavorite = async (userId: number, vehicleId: string) => {
  return await UserFavoriteVehicle.findOne({
    where: { userId, vehicleId },
  });
};

export const addFavorite = async (userId: number, vehicleId: string) => {
  return await UserFavoriteVehicle.create({ userId, vehicleId });
};

export const removeFavorite = async (existingFavorite: UserFavoriteVehicle) => {
  await existingFavorite.destroy();
};
