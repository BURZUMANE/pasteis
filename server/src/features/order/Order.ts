import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

export class Order extends Model {
    public id!: number;
    public orderUUID!: string;
    public weight!: number;
    public destination!: string;
    public lat!: number;
    public lon!: number;
    public observations!: string;
    public status!: 'unassigned' | 'assigned' | 'delivered';
    public date!: Date;
    public vehicleScheduleId?: number;

    static associate(models: any) {
        Order.belongsTo(models.VehicleSchedule, {
            foreignKey: 'vehicleScheduleId',
            as: 'vehicleSchedule'
        });
    }
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderUUID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    lon: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    observations: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('unassigned', 'assigned', 'delivered'),
        defaultValue: 'unassigned',
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    vehicleScheduleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'VehicleSchedules',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
});

export default Order;