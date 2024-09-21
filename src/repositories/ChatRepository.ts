import { Chat as TelegramChat } from 'node-telegram-bot-api'

import Chat from '../models/Chat'

class ChatRepository {
    async create(chat: TelegramChat): Promise<Chat> {
        return Chat.create({ ...chat })
    }

    async findById(id: number): Promise<Chat|null> {
        return Chat.findByPk(id)
    }

    async findAll(): Promise<Chat[]> {
        return Chat.findAll()
    }

    async delete(id: number): Promise<void> {
        await Chat.destroy({ where: { id } })
    }
}

export default new ChatRepository()
