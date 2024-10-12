import { Order } from "@/core/types/order";

export interface CreateVehicle {
    vehiclePlate: string;
    maxCapacity: number;
    availableCapacity: number;
}

export interface Vehicle {
    id: number;
    vehiclePlate: string;
    maxCapacity: number;
    availableCapacity: number;
    createdAt: string;
    updatedAt: string;
    schedules?: VehicleSchedule[];
    isFavorite?: boolean;
}

export interface VehicleSchedule {
    id: number;
    date: string;
    capacity: number;
    vehicleId: number;
    createdAt: string;
    updatedAt: string;
    orders?: Order[];
}

export interface VehicleFilters {
    vehiclePlate?: string;
    date?: string;
}
