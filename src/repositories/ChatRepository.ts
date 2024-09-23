import Chat from '../models/Chat'
import BaseRepository from './BaseRepository'

class ChatRepository extends BaseRepository<Chat> {}

export default new ChatRepository(Chat)
