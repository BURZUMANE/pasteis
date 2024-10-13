import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderRequest {
    @IsString() destination: string;
    @IsNumber() weight: number;
    @IsNumber() lat: number;
    @IsNumber() lon: number;
    @IsString() observations: string;
    @IsString() date: string;
}

export class AssignOrderRequest {
    @IsString() vehiclePlate: string;
    @IsString() orderUUID: string;
}




export class EditOrderRequest {
    @IsString()
    orderUUID: string;
    
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    vehiclePlate?: string;

    @IsString()
    @IsOptional()
    observations?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsOptional()
    @IsNumber()
    vehicleScheduleId?: number | null;
}
