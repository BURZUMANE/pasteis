import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class UserFavoriteVehicle extends Model {
  public userId!: number;
  public vehicleId!: number;

  static associate(models: any) {
    UserFavoriteVehicle.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UserFavoriteVehicle.belongsTo(models.Vehicle, {
      foreignKey: 'vehicleId',
      as: 'vehicle',
    });
  }
}

UserFavoriteVehicle.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vehicles',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'UserFavoriteVehicle',
    tableName: 'UserFavoriteVehicles',
    timestamps: false,
  }
);

export default UserFavoriteVehicle;
