import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize';
import Order from '../../order/Order';
import Vehicle from './Vehicle';

class VehicleOrder extends Model {
    public orderId!: number;
    public vehicleId!: number;
}

VehicleOrder.init(
    {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Order,
                key: 'id',
            },
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Vehicle,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'VehicleOrder',
    }
);

Order.belongsToMany(Vehicle, { through: VehicleOrder, foreignKey: 'orderId', as: 'vehicles' });
Vehicle.belongsToMany(Order, { through: VehicleOrder, foreignKey: 'vehicleId', as: 'orders' });

export default VehicleOrder;
