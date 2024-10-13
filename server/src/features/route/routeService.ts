import logger from "../../common/logger";
import { findVehicleWithSchedules } from "./RouteRepository";

export const getRoute = async (
    origin: [number, number],
    coordinates: Array<[number, number]>,
    destination: [number, number],
    transportMode: string = 'car',
): Promise<any> => {
    const apiKey = process.env.HERE_API_KEY;

    if (!apiKey) {
        throw new Error('Missing HERE API key in environment variables');
    }

    const url = buildRouteUrl({
        origin,
        coordinates,
        destination,
        transportMode,
        apiKey
    });

    return await fetchRoute(url);
};

const buildRouteUrl = ({
    origin,
    coordinates,
    destination,
    transportMode,
    apiKey
}: {
    origin: [number, number],
    coordinates: Array<[number, number]>,
    destination: [number, number],
    transportMode: string;
    apiKey: string;
}): string => {


    let url = `https://router.hereapi.com/v8/routes?apiKey=${apiKey}`;

    url += `&origin=${origin[0]},${origin[1]}`;
    url += `&destination=${destination[0]},${destination[1]}`;

    coordinates.forEach((via) => {
        url += `&via=${via[0].toFixed(4)},${via[1].toFixed(4)}`;
    });

    url += `&transportMode=${transportMode}`;
    return url;
};

const fetchRoute = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching route: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        logger.error(error);
        throw new Error('Failed to fetch route data');
    }
};

export const fetchDriversRoute = async (userId: number, vehiclePlate?: string, scheduleDate?: string) => {
    try {
        const vehicle = await findVehicleWithSchedules(vehiclePlate!, scheduleDate!);

        if (!vehicle) {
            throw new Error('No vehicle found with the specified vehicle plate.');
        }
        const plain = vehicle.get({ plain: true });
        const shcedules = plain.schedules[0]

        if (!shcedules) {
            return { orders: [], googleMapsUrl: '' };
        }
        const coordinates: Array<[number, number]> = shcedules.orders.map((order: any) => [order.lat, order.lon]);
        const origin: [number, number] = [38.7100, -9.1343];
        const destination: [number, number] = coordinates.pop();


        if (!destination || destination.length !== 2) {
            throw new Error('Invalid destination coordinates.');
        }


        const routeData = await getRoute(origin, coordinates, destination);

        if (!routeData || !routeData.routes || !routeData.routes[0] || !routeData.routes[0].sections) {
            logger.error('Invalid HERE API response:', routeData);
            throw new Error('Failed to retrieve valid route data from HERE API.');
        }

        const routedCoordinates = routeData.routes[0].sections.slice(1, -1).map((section: any) => {
            const lat = truncateToFourDecimals(section.departure.place.location.lat);
            const lng = truncateToFourDecimals(section.departure.place.location.lng);
            return [parseFloat(lat), parseFloat(lng)] as [number, number];
        });

        logger.info({ routedCoordinates });

        logger.info({ originalRoutes: shcedules.orders });
        const sortedOrders = matchOrdersToRoutedCoordinates(routedCoordinates, shcedules.orders);

        const unmatchedOrders = shcedules.orders.filter(order => !sortedOrders.includes(order));
        const finalOrders = [...sortedOrders, ...unmatchedOrders];

        const sortedCoordinates = finalOrders.map((order: any) => [order.lat, order.lon] as [number, number]);

        const googleMapsBaseUrl = 'https://www.google.com/maps/dir/?api=1';
        const googleMapsOrigin = `&origin=${origin[0]},${origin[1]}`;
        const googleMapsDestination = `&destination=${destination[0]},${destination[1]}`;
        const googleMapsWaypoints = sortedCoordinates.length > 0
            ? `&waypoints=${sortedCoordinates.slice(0, -1).map(coord => `${coord[0]},${coord[1]}`).join('|')}`
            : '';

        const googleMapsUrl = `${googleMapsBaseUrl}${googleMapsOrigin}${googleMapsDestination}${googleMapsWaypoints}`;

        return { orders: finalOrders, googleMapsUrl };
    } catch (error) {
        logger.error('Error fetching vehicle route:', error);
        throw new Error('Could not fetch vehicle route');
    }
};

function truncateToFourDecimals(num: number) {
    let numStr = num.toString();
    let [integerPart, decimalPart] = numStr.split('.');
    if (decimalPart) {
        decimalPart = decimalPart.substring(0, 4);
    }
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}

function areCoordinatesClose(coord1: [number, number], coord2: [number, number], tolerance = 0.001): boolean {
    const latDiff = Math.abs(coord1[0] - coord2[0]);
    const lngDiff = Math.abs(coord1[1] - coord2[1]);
    return latDiff <= tolerance && lngDiff <= tolerance;
}

const matchOrdersToRoutedCoordinates = (
    routedCoordinates: Array<[number, number]>,
    orders: Array<{ lat: number; lon: number;[key: string]: any }>
) => {
    const matchedOrders: Array<any> = [];

    routedCoordinates.forEach((routedCoord) => {
        const closestOrder = orders.find(order =>
            areCoordinatesClose(routedCoord, [order.lat, order.lon])
        );

        if (closestOrder) {
            matchedOrders.push(closestOrder);
            orders = orders.filter(order => order !== closestOrder);
        } else {
            logger.warn(`No match found for routed coordinate: ${routedCoord}`);
        }
    });

    return matchedOrders;
};
