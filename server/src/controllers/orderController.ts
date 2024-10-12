import { IsNumber, IsString } from 'class-validator';
import {
  BadRequestError,
  Body,
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
  QueryParam,
} from 'routing-controllers';
import { io } from '../server';
import {
  assignOrderToVehicleForOrderDate,
  completeOrder,
  createOrder,
  getAllOrders,
  sortOrdersByDistance,
} from '../services/orderService';

class CreateOrderRequest {
  @IsString() destination: string;
  @IsNumber() weight: number;
  @IsNumber() lat: number;
  @IsNumber() lon: number;
  @IsString() observations: string;
  @IsString() date: string;
}

class AssignOrderRequest {
  @IsString() vehiclePlate: string;
  @IsString() orderUUID: string;
}

@JsonController('/orders')
export class OrderController {
  @Get('/')
  async orders(
    @QueryParam('date') date?: string,
    @QueryParam('destination') destination?: string,
    @QueryParam('sort') sort?: string,
    @QueryParam('order') order?: 'ASC' | 'DESC',
    @QueryParam('status') status?: string
  ) {
    try {
      const filters = { date, destination, sort, order, status };
      const orders = await getAllOrders(filters);
      return orders;
    } catch (error) {
      throw new InternalServerError('Error retrieving orders');
    }
  }

  @Post('/')
  async createOrder(@Body() order: CreateOrderRequest) {
    try {
      const newOrder = await createOrder(order);
      return { message: 'Order created successfully', order: newOrder };
    } catch (error) {
      throw new BadRequestError('Error creating order: ' + error.message);
    }
  }

  @Post('/complete/:orderUUID')
  async completeOrder(@Param('orderUUID') orderUUID: string) {
    try {
      await completeOrder(orderUUID);
      return { message: `Order ${orderUUID} completed successfully.` };
    } catch (error) {
      throw new NotFoundError('Order not found or error completing order: ' + error.message);
    }
  }

  @Get('/sort/:vehiclePlate')
  async sortOrders(@Param('vehiclePlate') vehiclePlate: string) {
    try {
      const sortedOrders = await sortOrdersByDistance(vehiclePlate);
      return sortedOrders;
    } catch (error) {
      throw new BadRequestError('Error sorting orders by distance: ' + error.message);
    }
  }

  @Post('/assign')
  async assignOrderToVehicle(@Body() assignRequest: AssignOrderRequest) {
    const { orderUUID, vehiclePlate } = assignRequest;
    console.log({ orderUUID, vehiclePlate })
    try {
      const result = await assignOrderToVehicleForOrderDate(orderUUID, vehiclePlate);
      return result;
    } catch (error) {
      throw new BadRequestError('Error assigning order: ' + error.message);
    }
  }

  @Get('/test')
  async test() {
    io.to('managers').emit('orderCompleted', { orderUUID: 'xxxx' });
    return { test: 'xxx' };
  }
}

export default OrderController;
