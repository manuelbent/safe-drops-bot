import { Model, DataTypes } from 'sequelize'

import sequelize from '../database/sequelize'

class Chat extends Model {
    public id!: number
    public username!: string
    public first_name?: string
    public subscribed_at!: Date
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subscribed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
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
