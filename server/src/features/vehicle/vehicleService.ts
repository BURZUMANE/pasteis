
import { ConflictError } from '../../common/errors';
import logger from '../../common/logger';
import * as VehicleRepository from './VehicleRepository';

export const fetchVehiclesWithFavorites = async (userId: number, vehiclePlate?: string, scheduleDate?: string) => {
  const vehicleFilter = vehiclePlate ? { vehiclePlate } : {};
  const scheduleFilter = scheduleDate ? { date: scheduleDate } : {};
  const vehicleList = await VehicleRepository.findAllVehicles(vehicleFilter, scheduleFilter);
  const userFavoriteRecords = await VehicleRepository.findUserFavoriteVehicles(userId);
  const favoriteVehicleIds = new Set(userFavoriteRecords.map(favorite => favorite.vehicleId));

  const vehiclesWithFavoriteStatus = vehicleList.map(vehicle => ({
    ...vehicle.get({ plain: true }),
    isFavorite: favoriteVehicleIds.has(vehicle.id),
  }));

  return vehiclesWithFavoriteStatus.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
};

export const retrieveAllVehicles = async (userId: number, scheduleDate?: string, vehiclePlate?: string) => {
  return await fetchVehiclesWithFavorites(userId, vehiclePlate, scheduleDate);
};

export const addNewVehicle = async (vehicleData: {
  vehiclePlate: string,
  maxCapacity: number,
  availableCapacity: number,
}) => {
  if (vehicleData.availableCapacity > vehicleData.maxCapacity) {
    throw new ConflictError('Available capacity cannot exceed maximum capacity');
  }

  return await VehicleRepository.createVehicle(vehicleData);
};


export const toggleFavoriteVehicle = async (userId: number, vehicleId: string) => {
  const existingFavorite = await VehicleRepository.findFavorite(userId, vehicleId);

  if (existingFavorite) {
    await VehicleRepository.removeFavorite(existingFavorite);
    return { message: 'Vehicle removed from favorites' };
  } else {
    await VehicleRepository.addFavorite(userId, vehicleId);
    return { message: 'Vehicle added to favorites' };
  }
};
