import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { BadRequestError, Body, Get, JsonController, Param, Post, QueryParams } from 'routing-controllers';
import { Order, UserFavoriteVehicle, Vehicle, VehicleSchedule } from '../models';
import { addNewVehicle, retrieveAllVehicles } from './vehicleService';

class CreateVehicleRequest {
  @IsString() vehiclePlate: string;
  @IsNumber() maxCapacity: number;
  @IsNumber() availableCapacity: number;
}

class GetVehiclesQuery {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsOptional()
  @IsDateString()
  scheduleDate?: string;

  @IsOptional()
  @IsString()
  vehiclePlate?: string;
}

@JsonController('/vehicles')
export class VehicleController {
  @Get('/')
  async fetchAllVehicles(@QueryParams() query: GetVehiclesQuery) {
    const vehicles = await retrieveAllVehicles(query.userId, query.scheduleDate, query.vehiclePlate);
    return vehicles;
  }

  @Post('/')
  async createNewVehicle(@Body() vehicleRequest: CreateVehicleRequest) {
    try {
      const newVehicle = await addNewVehicle({
        vehiclePlate: vehicleRequest.vehiclePlate,
        maxCapacity: vehicleRequest.maxCapacity,
        availableCapacity: vehicleRequest.availableCapacity,
      });
      return {
        message: 'Vehicle created successfully',
        vehicle: newVehicle.toJSON(),
      };
    } catch (error) {
      throw new BadRequestError('Error assigning order: ' + error.message);
    }
  }


  @Post('/:vehicleId/toggleFavourite')
  async toggleFavourite(@Param('vehicleId') vehicleId: string, @Body() body: { userId: number }) {
    const existingFavorite = await UserFavoriteVehicle.findOne({
      where: { userId: body.userId, vehicleId },
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      return { message: 'Vehicle removed from favorites' };
    } else {
      await UserFavoriteVehicle.create({ userId: body.userId, vehicleId });
      return { message: 'Vehicle added to favorites' };
    }
  }
}

