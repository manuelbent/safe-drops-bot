import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'

class UpcomingItem extends Model {
    public id!: number
    public title!: string
    public subtitle!: string
    public effectiveStartSellDate!: Date
    public imgURL!: string
    public styleColor!: string
}

UpcomingItem.init(
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
        effectiveStartSellDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'effective_start_sell_date',
        },
        imgURL: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'img_url',
        },
        styleColor: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'style_color',
        }
    },
    {
        sequelize,
        modelName: 'UpcomingItem',
        tableName: 'upcoming_items',
        timestamps: false,
    }
)

export default UpcomingItem
