import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import UserFavoriteVehicle from './UserFavoriteVehicle';

export class Vehicle extends Model {
  public id!: number;
  public vehiclePlate!: string;
  public maxCapacity!: number;
  public availableCapacity!: number;

  static async isFavoritedByUser(vehicleId: number, userId: number): Promise<boolean> {
    const favorite = await UserFavoriteVehicle.findOne({
      where: { vehicleId, userId },
    });
    return !!favorite;
  }

  static associate(models: any) {
    Vehicle.belongsToMany(models.User, {
      through: models.UserFavoriteVehicle,
      foreignKey: 'vehicleId',
      otherKey: 'userId',
      as: 'favoritedByUsers',
    });

    Vehicle.hasMany(models.VehicleSchedule, {
      foreignKey: 'vehicleId',
      as: 'schedules',
    });
  }
}

Vehicle.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehiclePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  maxCapacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  availableCapacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Vehicle',
  tableName: 'Vehicles',
});

export default Vehicle;
