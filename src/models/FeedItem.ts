import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'

class FeedItem extends Model {
    public id!: number
    public type!: string
    public title!: string
    public imgURL!: string
    public effectiveStartSellDate?: Date
    public styleColor?: string
    public reserveStart?: Date
    public reserveEnd?: Date
}

FeedItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imgURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        effectiveStartSellDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'effective_start_sell_date',
        },
        styleColor: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'style_color',
        },
        reserveStart: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'reserve_start',
        },
        reserveEnd: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'reserve_end',
        }
    },
    {
        sequelize,
        modelName: 'FeedItem',
        tableName: 'feed_items',
        timestamps: false,
    }
)

export default FeedItem
