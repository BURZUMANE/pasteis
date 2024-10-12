import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export class VehicleSchedule extends Model {
    public id!: number;
    public date!: Date;
    public vehicleId!: number;
    public loadedCapacity!: number;

    static associate(models: any) {
        VehicleSchedule.belongsTo(models.Vehicle, {
            foreignKey: 'vehicleId',
            as: 'vehicle',
        });

        VehicleSchedule.hasMany(models.Order, {
            foreignKey: 'vehicleScheduleId',
            as: 'orders',
        });
    }
}

VehicleSchedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vehicles',
            key: 'id',
        },
    },
    loadedCapacity: {
        type: DataTypes.VIRTUAL,
        get() {
            const orders = this.getDataValue('orders') || [];
            return orders.reduce((sum: number, order: any) => {
                const isDelivered = order.status === 'delivered';
                return isDelivered ? sum : sum + (order.weight || 0);
            }, 0);
        },
    },
}, {
    sequelize,
    modelName: 'VehicleSchedule',
    tableName: 'VehicleSchedules',
});

export default VehicleSchedule;
