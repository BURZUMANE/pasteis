import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize';

interface DriverVehicleAssignmentAttributes {
    id: number;
    userId: number;
    vehicleId: number;
    assignedAt: Date;
    unassignedAt?: Date | null;
}

interface DriverVehicleAssignmentCreationAttributes
    extends Optional<DriverVehicleAssignmentAttributes, 'id' | 'unassignedAt'> { }

export class DriverVehicleAssignment extends Model<
    DriverVehicleAssignmentAttributes,
    DriverVehicleAssignmentCreationAttributes
> {
    public id!: number;
    public userId!: number;
    public vehicleId!: number;
    public assignedAt!: Date;
    public unassignedAt!: Date | null;

    static associate(models: any) {
        DriverVehicleAssignment.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });

        DriverVehicleAssignment.belongsTo(models.Vehicle, {
            foreignKey: 'vehicleId',
            as: 'vehicle',
        });
    }
}

DriverVehicleAssignment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Vehicles',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        assignedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        unassignedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'DriverVehicleAssignment',
        tableName: 'DriverVehicleAssignments',
    }
);

export default DriverVehicleAssignment;
