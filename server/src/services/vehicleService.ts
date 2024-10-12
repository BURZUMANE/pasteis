import { Vehicle, Order, VehicleSchedule, User, UserFavoriteVehicle } from '../models';

export const fetchVehiclesWithFavorites = async (userId: number, vehiclePlate?: string, scheduleDate?: string) => {
  try {
    const vehicleFilter = vehiclePlate ? { vehiclePlate } : {};
    const scheduleFilter = scheduleDate ? { date: scheduleDate } : {};

    const vehicleList = await Vehicle.findAll({
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
            }
          ]
        }
      ]
    });

    const userFavoriteRecords = await UserFavoriteVehicle.findAll({
      where: { userId },
      attributes: ['vehicleId'],
    });

    const favoriteVehicleIds = new Set(userFavoriteRecords.map(favorite => favorite.vehicleId));

    const vehiclesWithFavoriteStatus = vehicleList.map(vehicle => ({
      ...vehicle.get({ plain: true }),
      isFavorite: favoriteVehicleIds.has(vehicle.id),
    }));

    const sortedVehicles = vehiclesWithFavoriteStatus.sort((a, b) => {
      return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
    });

    return sortedVehicles;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw new Error('Could not fetch vehicles');
  }
};



export async function retrieveAllVehicles(userId: number, scheduleDate?: string, vehiclePlate?: string) {
  const vehicles = await fetchVehiclesWithFavorites(userId, vehiclePlate, scheduleDate);
  return vehicles;
}

export async function addNewVehicle(vehicleData: any) {
  return await Vehicle.create(vehicleData);
}
