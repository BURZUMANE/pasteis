export type OrderStatus = 'unassigned' | 'assigned' | 'delivered';

export interface OrderDTO {
  weight: number;
  destination: string;
  lat: number;
  lon: number;
  observations: string;
  status: OrderStatus;
  date: string;
}

export interface OrderResponseItem extends OrderDTO {
  id: number;
  orderUUID: string;
  vehiclePlate: string | null;
  createdAt: string;
  updatedAt: string;
  vehicleSchedule?: VehicleSchedule | null
}