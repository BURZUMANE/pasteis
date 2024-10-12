import { Sequelize } from 'sequelize';
import { Vehicle } from './Vehicle';
import { VehicleSchedule } from './VehicleSchedule';
import { User } from './User';
import UserFavoriteVehicle from './UserFavoriteVehicle';
import DriverVehicleAssignment from './DriverVehicleAssignment';
import Order from './Order';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

User.init(User.getAttributes(), { sequelize, modelName: 'User' });
UserFavoriteVehicle.init(UserFavoriteVehicle.getAttributes(), { sequelize, modelName: 'UserFavoriteVehicle' });
Vehicle.init(Vehicle.getAttributes(), { sequelize, modelName: 'Vehicle' });
Order.init(Order.getAttributes(), { sequelize, modelName: 'Order' });
VehicleSchedule.init(VehicleSchedule.getAttributes(), { sequelize, modelName: 'VehicleSchedule' });
DriverVehicleAssignment.init(DriverVehicleAssignment.getAttributes(), { sequelize, modelName: 'DriverVehicleAssignment' });

User.associate({ Vehicle, UserFavoriteVehicle, DriverVehicleAssignment });
UserFavoriteVehicle.associate({ User, Vehicle });
Vehicle.associate({ VehicleSchedule, UserFavoriteVehicle, User, DriverVehicleAssignment });
VehicleSchedule.associate({ Vehicle, Order });
DriverVehicleAssignment.associate({ User, Vehicle });

const models = {
  Order,
  Vehicle,
  VehicleSchedule,
  User,
  UserFavoriteVehicle,
  DriverVehicleAssignment,
};

export { sequelize };
export { Order, Vehicle, VehicleSchedule, User, UserFavoriteVehicle, DriverVehicleAssignment };
export default models;
