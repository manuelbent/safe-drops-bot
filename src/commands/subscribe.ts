import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatRepository from '../repositories/ChatRepository'

export default (bot: TelegramBot) => async ({ chat }: Message) => {
    // if the chat is already subscribed, there is no need to subscribe again
    if (await chatRepository.findById(chat.id)) return

    // subscribe the chat
    try {
        await chatRepository.create(chat)
        await bot.sendMessage(chat.id, 'Alright! I will notify you when a SHOCK DROP is happening!')
        await bot.sendMessage(chat.id, 'To unsubscribe, type /unsubscribe.')
        logger.info(`Chat ${chat.id} subscribed`)
    } catch (error) {
        logger.error(`Something went wrong while subscribing chat ${chat.id}: ${error}`)
    }
}
