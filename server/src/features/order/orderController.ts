import {
  BadRequestError,
  Body,
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  QueryParam,
} from 'routing-controllers';
import { io } from '../../server';
import {
  assignOrderToVehicle,
  completeOrder,
  createOrder,
  editOrder,
  getOrders,
  sortOrdersByDistance,
} from './orderService';
import { AssignOrderRequest, CreateOrderRequest, EditOrderRequest } from './orderRequests';


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
      const orders = await getOrders(filters);
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
    try {
      const result = await assignOrderToVehicle(orderUUID, vehiclePlate);
      return result;
    } catch (error) {
      throw new BadRequestError('Error assigning order: ' + error.message);
    }
  }

  @Put('/')
  async editOrder(@Body() assignRequest: EditOrderRequest) {
    const order = assignRequest;
    try {
      const result = await editOrder(order);
      return result;
    } catch (error) {
      throw new BadRequestError('Error assigning order: ' + error.message);
    }
  }
}

export default OrderController;
