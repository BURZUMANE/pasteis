import bcrypt from 'bcrypt';
import { User } from '../../features/user/models/User';
import { Vehicle } from '../../features/vehicle/models/Vehicle';
import { DriverVehicleAssignment } from '../../features/vehicle/models/DriverVehicleAssignment';
import { v4 as uuidv4 } from 'uuid';
import Order from '../../features/order/Order';
import dayjs from 'dayjs';
import logger from '../../common/logger';
import UserFavoriteVehicle from '../../features/user/models/UserFavoriteVehicle';

const coordinates = [
    [38.7169, -9.1399],
    [38.7205, -9.1454],
    [38.7072, -9.1352],
    [38.7246, -9.1492],
    [38.7142, -9.1261],
    [38.7190, -9.1320],
    [38.7315, -9.1545],
    [38.7094, -9.1440],
    [38.7329, -9.1408],
    [38.7371, -9.1530],
    [38.7400, -9.1402],
    [38.7111, -9.1325],
    [38.7485, -9.1634],
    [38.7235, -9.1342],
    [38.7068, -9.1360],
    [38.7252, -9.1397],
    [38.7172, -9.1526],
    [38.7348, -9.1321],
    [38.7472, -9.1465],
    [38.7156, -9.1479],
    [38.7334, -9.1532],
    [38.7317, -9.1578],
    [38.7211, -9.1432],
    [38.7356, -9.1409],
    [38.7410, -9.1314],
    [38.7214, -9.1412],
    [38.7059, -9.1290],
    [38.7123, -9.1403],
    [38.7491, -9.1514],
    [38.7413, -9.1547],
    [38.7225, -9.1365],
    [38.7147, -9.1308],
    [38.7378, -9.1468],
    [38.7283, -9.1380],
    [38.7188, -9.1497],
    [38.7431, -9.1403],
    [38.7115, -9.1297],
    [38.7325, -9.1560],
    [38.7350, -9.1359],
    [38.7480, -9.1442],
    [38.7141, -9.1533],
    [38.7195, -9.1371],
    [38.7457, -9.1540],
    [38.7365, -9.1452],
    [38.7298, -9.1316],
    [38.7137, -9.1450],
    [38.7496, -9.1571],
    [38.7159, -9.1293],
    [38.7417, -9.1367],
    [38.7128, -9.1492],
    [40.4168, -3.7038],
    [41.3879, 2.1699],
    [37.3891, -5.9845],
    [39.4699, -0.3763],
    [43.2630, -2.9350],
    [37.1773, -3.5986],
    [36.7213, -4.4214],
    [40.9641, -5.6635],
    [39.8592, -4.0207],
    [42.8185, -1.6441],
    [41.6561, -0.8773],
    [39.5708, 2.6502],
    [36.5328, -6.2923],
    [37.5882, -0.9817],
    [43.0125, -7.5559],
    [40.9716, -4.1264],
    [38.7223, -1.8574],
    [41.1103, -1.1564],
    [43.5293, -5.6773],
    [42.6043, -5.5739],
    [37.8786, -4.7794],
    [39.8617, -4.0273],
    [39.8628, -4.8305],
    [36.5312, -6.2872],
    [38.3452, -0.4810],
    [42.1318, -1.4701],
    [40.7785, -3.0303],
    [41.6144, -0.6171],
    [42.2370, -8.7145],
    [43.3709, -8.3958],
    [38.6932, -9.2273],
    [38.6687, -9.0959],
    [38.7369, -9.3023],
    [38.8038, -9.3807],
    [38.7000, -9.1333],
    [39.2786, -9.0136],
    [39.5990, -8.4037],
    [39.3980, -8.1863],
    [37.0955, -8.2472],
    [36.9789, -7.8722],
    [39.5954, -8.4041],
    [39.3434, -8.5830],
    [40.2391, -7.3873],
    [40.3684, -7.2124],
    [41.1496, -8.6110],
    [38.7796, -9.1793],
    [38.7766, -9.2978],
    [41.5360, -8.6156],
    [38.9239, -9.4097],
    [38.5167, -8.9000]
];


type UserRole = 'driver' | 'manager';

const selectedIndices = new Set<number>(); 

const getRandomCoordinates = () => {
    if (selectedIndices.size >= coordinates.length) {
        throw new Error("All coordinates have been used.");
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * coordinates.length);
    } while (selectedIndices.has(randomIndex));

    selectedIndices.add(randomIndex); 
    const [lat, lon] = coordinates[randomIndex];
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
    maxCapacity: i === 0 ? 500 : Math.floor(500 + Math.random() * 1500),
    availableCapacity: Math.floor(500 + Math.random() * 1500),
}));

const usersData: Array<{ userNickname: string; password: string; name: string; role: UserRole }> = [
    {
        userNickname: 'Driver',
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
            const driverUser = await User.findOne({ where: { userNickname: 'Driver' } });
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