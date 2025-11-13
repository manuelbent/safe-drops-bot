import { Chat as TelegramChat } from 'node-telegram-bot-api'

import Chat from '../models/Chat'

import chatRepository from '../repositories/ChatRepository'

class ChatService {
    async findAll(): Promise<Chat[]> {
        return chatRepository.findAll()
    }

    async findByMarketId(marketId: number): Promise<Chat[]> {
        return chatRepository.findBy({ marketId })
    }

    async create(chat: TelegramChat, marketId?: number): Promise<Chat> {
        return chatRepository.create({ ...chat, marketId })
    }

    async exists(id: number): Promise<boolean> {
        return !!(await chatRepository.findById(id))
    }

    async delete(id: number): Promise<void> {
        await chatRepository.delete(id)
    }
}

export default new ChatService()
