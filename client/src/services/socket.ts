import { config } from '@/config';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(config.API_URL, {
      reconnectionAttempts: 5, 
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  return socket;
};
