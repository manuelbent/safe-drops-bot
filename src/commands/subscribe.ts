import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import cache from '../datastore/Cache'

export default (bot: TelegramBot) => async ({ chat }: Message) => {
    // if the chat is already subscribed, there is no need to subscribe again
    if (cache.subscriptions.has(chat.id)) return

    // subscribe the chat
    try {
        cache.subscriptions.set(chat.id, chat)
        await bot.sendMessage(chat.id, 'Alright! I will notify you when a SHOCK DROP is happening!')
        await bot.sendMessage(chat.id, 'To unsubscribe, type /unsubscribe.')
        logger.info(`Chat ${ chat.id } subscribed`)
    } catch (error) {
        logger.error(`Something went wrong while subscribing chat ${ chat.id }: ${error}`)
    }
}
