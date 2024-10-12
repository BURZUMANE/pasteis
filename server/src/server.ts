import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { sequelize } from './models';
import seedDatabase from './seedDatabase';
import configureSocket from './services/socketService';
import logger from './utils/logger';

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

configureSocket(io);

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    logger.info('Database synchronized');

    await seedDatabase();
    
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Error starting the server:', error);
    process.exit(1);
  }
};

const shutdown = () => {
  logger.info('Shutting down the server...');
  server.close(() => {
    logger.info('Server closed');
    sequelize.close().then(() => {
      logger.info('Database connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();

export { io };