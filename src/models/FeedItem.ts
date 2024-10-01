import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'

class FeedItem extends Model {
    public id!: number
    public hashKey!: string
    public type!: string
    public title!: string
    public imgURL!: string
    public validDate?: Date
    public effectiveStartSellDate?: Date
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
        hashKey: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'hash_key',
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
            field: 'img_url',
        },
        validDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'valid_date',
        },
        effectiveStartSellDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'effective_start_sell_date',
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
        },
    },
    {
        sequelize,
        modelName: 'FeedItem',
        tableName: 'feed_items',
        timestamps: false,
    }
)

export default FeedItem
