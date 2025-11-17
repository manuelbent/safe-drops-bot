import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'

class OvpnConfig extends Model {
    public id!: number
    public configPath!: string
    public connectedAt!: Date
}

OvpnConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        configPath: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'config_path',
        },
        connectedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'connected_at',
        },
    },
    {
        sequelize,
        modelName: 'OvpnConfig',
        tableName: 'ovpn_configs',
        timestamps: false,
    }
)

export default OvpnConfig
