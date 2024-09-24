import { Model, DataTypes } from 'sequelize'

import sequelize from '../../database/sequelize'

class Chat extends Model {
    public id!: number
    public subscribedAt!: Date
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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

export default Chat
