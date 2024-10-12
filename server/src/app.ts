import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { OrderController } from './controllers/orderController';
import { UserController } from './controllers/userController';
import { VehicleController } from './controllers/vehicleController';
import swaggerUi from 'swagger-ui-express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

const app = createExpressServer({
  controllers: [OrderController, UserController, VehicleController],
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});

const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, {
  routePrefix: '',
  controllers: [OrderController, UserController, VehicleController],
}, {
  info: {
    title: 'Logistics Management API',
    version: '1.0.0',
  },
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

export default app;
