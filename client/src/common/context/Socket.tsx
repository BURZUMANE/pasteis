import { config } from '@/config/config';
import useToast from '@/common/hooks/useToast';
import { User } from '@/common/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ISocketContext {
    socket: Socket | null;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

const useSocketListeners = (socket: Socket | null) => {
    const { showToast } = useToast();

    useEffect(() => {
        if (!socket) return;

        const handleOrderCompleted = (data: { orderUUID: string }) => {
            showToast(`Order ID: ${data.orderUUID} has been delivered`, 'info');
        };


        const handleOrderAssigned = (data: { orderUUID: string }) => {
            showToast(`Order ID: ${data.orderUUID} has been assigned to you`, 'info');
        };

        socket.on('orderCompleted', handleOrderCompleted);
        socket.on('orderAssigned', handleOrderAssigned);

        return () => {
            socket.off('orderCompleted', handleOrderCompleted);
            socket.off('orderAssigned', handleOrderAssigned);
        };
    }, [socket, showToast]);
};

export const SocketProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (user) {
            const socketInstance = io(config.API_URL, {
                query: {
                    role: user.role,
                    userId: user.userId,
                    vehiclePlate: user.vehiclePlate
                },
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [user]);

    useSocketListeners(socket);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
