export interface Order {
    id: number;
    orderUUID: string;
    weight: number;
    destination: string;
    lat: number;
    lon: number;
    observations?: string;
    status: 'unassigned' | 'assigned' | 'delivered';
    date: string;
    vehicleScheduleId: number;
    vehiclePlate: string;
    createdAt: string;
    updatedAt: string;
}
