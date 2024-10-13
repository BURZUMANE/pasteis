export enum OrderStatus {
  Unassigned = 'unassigned',
  Assigned = 'assigned',
  Delivered = 'delivered'
};

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