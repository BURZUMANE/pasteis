import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize';

interface UserAttributes {
  id: number;
  userNickname: string;
  name: string;
  password: string;
  role: 'driver' | 'manager';
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public userNickname!: string;
  public name!: string;
  public password!: string;
  public role!: 'driver' | 'manager';

  static associate(models: any) {
    User.belongsToMany(models.Vehicle, {
      through: models.UserFavoriteVehicle,
      foreignKey: 'userId', 
      otherKey: 'vehicleId',
      as: 'favoriteVehicles', 
    })
    User.hasMany(models.DriverVehicleAssignment, {
      foreignKey: 'userId',
      as: 'assignments',
    });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userNickname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('driver', 'manager'),
    allowNull: false,
    defaultValue: 'driver',
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
});

export default User;
