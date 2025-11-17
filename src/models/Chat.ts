import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'
import Market from './Market'

class Chat extends Model {
    public id!: number
    public marketId!: number | null
    public subscribedAt!: Date
    public market?: Market
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        marketId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'market_id',
        },
        subscribedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'subscribed_at',
        }
    },
    {
        sequelize,
        modelName: 'Chat',
        tableName: 'chats',
        timestamps: false,
    }
)

Chat.belongsTo(Market, {
    foreignKey: 'marketId',
    as: 'market',
})

export default Chat
