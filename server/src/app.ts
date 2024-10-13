import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { OrderController } from './features/order/orderController';
import { UserController } from './features/user/userController';
import { VehicleController } from './features/vehicle/vehicleController';
import swaggerUi from 'swagger-ui-express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { RouteController } from './features/route/routeController';

const app = createExpressServer({
  controllers: [OrderController, UserController, VehicleController, RouteController],
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
