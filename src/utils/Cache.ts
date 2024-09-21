import { Chat } from 'node-telegram-bot-api'

class Cache {
    subscriptions = new Map<number, Chat>()
}

export default new Cache()
