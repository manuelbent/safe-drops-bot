import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import cache from '../datastore/Cache'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, cache.subscriptions.has(id) ? 'Subscribed' : 'Unsubscribed')
    } catch (error) {
        logger.error(error)
    }
}
