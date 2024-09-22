import { Model, DataTypes } from 'sequelize'

import sequelize from '../database/sequelize'

class Release extends Model {
    public id!: number
    public title!: string
    public subtitle!: string
    public effective_start_sell_date!: Date
    public img_url!: string
}

Release.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        effective_start_sell_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        img_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Release',
        tableName: 'releases',
        timestamps: false,
    }
)

export default Release
