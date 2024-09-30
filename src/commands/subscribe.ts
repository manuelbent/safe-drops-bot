import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'

export default (bot: TelegramBot) => async ({ chat }: Message) => {
    // if the chat is already subscribed, there is no need to subscribe again
    if (await chatService.exists(chat.id)) return

    // subscribe the chat
    try {
        await chatService.create(chat)
        await bot.sendMessage(chat.id, 'Alright! I will keep you updated with the latest news!')
        await bot.sendMessage(chat.id, 'To unsubscribe, type /unsubscribe.')
        logger.info(`Chat ${chat.id} subscribed`)
    } catch (error) {
        logger.error(`Something went wrong while subscribing chat ${chat.id}: ${error}`)
    }
}
