import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'

class Market extends Model {
    public id!: number
    public code!: string
    public label!: string
    public emoji!: string
    public adjective!: string
    public apiUrl!: string
    public createdAt!: Date
    public updatedAt!: Date
}

Market.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(2),
            allowNull: false,
            unique: true,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emoji: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        adjective: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apiUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'api_url',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'updated_at',
        },
    },
    {
        sequelize,
        modelName: 'Market',
        tableName: 'markets',
        timestamps: false,
    }
)

export default Market

