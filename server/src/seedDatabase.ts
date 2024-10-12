import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Vehicle } from './models/Vehicle';
import UserFavoriteVehicle from './models/UserFavoriteVehicle';
import { DriverVehicleAssignment } from './models/DriverVehicleAssignment';
import { v4 as uuidv4 } from 'uuid';
import Order from './models/Order';
import dayjs from 'dayjs';
import logger from './utils/logger';

type UserRole = 'driver' | 'manager';

const getRandomCoordinates = () => {
    const lat = 37 + Math.random() * (41 - 37);
    const lon = -9.5 + Math.random() * (2);
    return { lat, lon };
};

const generateVehiclePlate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const randomChars = (length: number) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randomNumbers = (length: number) => Array.from({ length }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    return `${randomChars(2)}-${randomNumbers(2)}-${randomChars(2)}`;
};

const vehiclesData = Array.from({ length: 10 }).map((_, i) => ({
    vehiclePlate: i === 0 ? 'PT-81-EL' : generateVehiclePlate(),
    maxCapacity: i === 0 ? 100000000 : Math.floor(500 + Math.random() * 1500),
    availableCapacity: Math.floor(500 + Math.random() * 1500),
}));

const usersData: Array<{ userNickname: string; password: string; name: string; role: UserRole }> = [
    {
        userNickname: 'Dogger',
        password: 'password',
        name: 'Dennis Init',
        role: 'driver',
    },
    {
        userNickname: 'BigBoss777',
        password: 'password',
        name: 'Miguel Almeida Santos',
        role: 'manager',
    }
];

const ordersData = Array.from({ length: 10 }).map(() => {
    const { lat, lon } = getRandomCoordinates();
    const status = 'unassigned';

    return {
        orderUUID: uuidv4(),
        weight: Math.floor(100 + Math.random() * 900),
        destination: `Location-${Math.floor(Math.random() * 100)}`,
        lat,
        lon,
        observations: Math.random() > 0.5 ? "Handle with care" : null,
        status: status as 'unassigned' | 'assigned',
        date: dayjs().toDate(),
    };
});

const favoriteVehiclesData = [
    { userNickname: 'BigBoss777', vehiclePlate: 'PT-81-EL' },
];

async function seedDatabase() {
    try {
        const vehiclesCount = await Vehicle.count();
        if (vehiclesCount === 0) {
            await Vehicle.bulkCreate(vehiclesData);
        }

        const usersCount = await User.count();
        if (usersCount === 0) {
            for (const userData of usersData) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await User.create({ ...userData, password: hashedPassword });
            }
        }

        const ordersCount = await Order.count();
        if (ordersCount === 0) {
            await Order.bulkCreate(ordersData);
        }

        const assignmentsCount = await DriverVehicleAssignment.count();
        if (assignmentsCount === 0) {
            const driverUser = await User.findOne({ where: { userNickname: 'Dogger' } });
            const vehicle = await Vehicle.findOne({ where: { vehiclePlate: 'PT-81-EL' } });

            if (driverUser && vehicle) {
                await DriverVehicleAssignment.create({
                    userId: driverUser.id,
                    vehicleId: vehicle.id,
                    assignedAt: new Date(),
                });
            } else {
                console.error('Driver or Vehicle not found for assignment.');
            }
        }

        const favoriteVehiclesCount = await UserFavoriteVehicle.count();
        if (favoriteVehiclesCount === 0) {
            for (const favoriteVehicle of favoriteVehiclesData) {
                const user = await User.findOne({ where: { userNickname: favoriteVehicle.userNickname } });
                const vehicle = await Vehicle.findOne({ where: { vehiclePlate: favoriteVehicle.vehiclePlate } });

                if (user && vehicle) {
                    await UserFavoriteVehicle.create({ userId: user.id, vehicleId: vehicle.id });
                } else {
                    console.error('User or Vehicle not found for favorite vehicle.');
                }
            }
        }

        logger.info('Seeding complete');
    } catch (error) {
        logger.error('Error seeding the database:', error);
    }
}

export default seedDatabase;