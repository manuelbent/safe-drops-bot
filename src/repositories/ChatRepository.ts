import BaseRepository from './BaseRepository'

import Chat from '../models/Chat'
import Market from '../models/Market'

/**
 * @class ChatRepository
 */
class ChatRepository extends BaseRepository<Chat> {
    async findAll(): Promise<Chat[]> {
        return super.findAll([{ model: Market, as: 'market' }])
    }
}

export default new ChatRepository(Chat)
