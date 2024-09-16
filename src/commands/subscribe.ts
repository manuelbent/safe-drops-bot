import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import cache from '../datastore/Cache'

export default (bot: TelegramBot) => async ({ chat }: Message) => {
    if (!cache.subscriptions.has(chat.id)) {
        try {
            cache.subscriptions.set(chat.id, chat)
            await bot.sendMessage(chat.id, 'Alright! I will notify you when a SHOCK DROP is happening!')
            await bot.sendMessage(chat.id, 'To unsubscribe, type /unsubscribe.')
        } catch (error) {
            logger.error(error)
        }
    }
}
