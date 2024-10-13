import { Get, JsonController, QueryParams } from "routing-controllers";
import { fetchDriversRoute } from "./routeService";
import { IsDateString, IsNumber, IsString } from "class-validator";

class GetRouteQuery {
    @IsNumber()
    userId: number;

    @IsDateString()
    scheduleDate: string;

    @IsString()
    vehiclePlate: string;
}

@JsonController('/route')
export class RouteController {
    @Get('/')
    async fetchDriversRoute(@QueryParams() query: GetRouteQuery) {
        const vehicles = await fetchDriversRoute(query.userId, query.vehiclePlate, query.scheduleDate);
        return vehicles;
    }
}
