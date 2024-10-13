import { Server } from 'socket.io';
import logger from '../common/logger';

export const userSocketMap: Map<number, string> = new Map();

declare module 'socket.io' {
    interface Socket {
        userId?: string;
        vehiclePlate?: string;
        role?: string;
    }
}

const pluralizeRole = (role: string) => `${role}s`;

const configureSocket = (io: Server) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId as string;
        const role = socket.handshake.query.role as string;
        const vehiclePlate = socket.handshake.query.vehiclePlate as string;

        if (vehiclePlate && role) {
            const pluralRole = pluralizeRole(role);
            socket.join(pluralRole);
            socket.vehiclePlate = vehiclePlate;
            socket.role = role;

            userSocketMap.set(Number(userId), socket.id);

            logger.info(userId);
            logger.info(socket.id);
            logger.info(`User ${userId} joined ${pluralRole} room`);
            logger.info(`VehiclePlate: ${vehiclePlate}`);
        }

        socket.on('orderCompleted', (orderUUID) => {
            logger.info('Order marked as completed on server:', orderUUID);
            io.to('managers').emit('orderCompleted', { orderUUID });
        });

        socket.on('sendMessageToUser', (targetUserId, message) => {
            const targetSocketId = userSocketMap.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('privateMessage', message);
            } else {
                logger.warn(`User with ID ${targetUserId} not connected`);
            }
        });

        socket.on('disconnect', () => {
            logger.info(`Client with userId ${vehiclePlate} disconnected`);
            if (vehiclePlate) {
                userSocketMap.delete(Number(userId));
            }
        });
    });
};

export default configureSocket;
