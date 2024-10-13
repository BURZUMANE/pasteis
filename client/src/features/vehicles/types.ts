interface Vehicle {
    id: number;
    vehiclePlate: string;
    maxCapacity: number;
    availableCapacity: number;
    createdAt: string;
    updatedAt: string;
}

interface VehicleSchedule {
    loadedCapacity: number;
    id: number;
    date: string;
    vehicleId: number;
    createdAt: string;
    updatedAt: string;
    vehicle: Vehicle;
}

interface CreateVehicleDTO {
    vehiclePlate: string;
    maxCapacity: number;
    availableCapacity: number;
}
