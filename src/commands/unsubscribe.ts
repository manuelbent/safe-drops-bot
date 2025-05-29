import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    // if the chat is not subscribed, there is no need to unsubscribe
    if (!(await chatService.exists(id))) return

    // unsubscribe the chat
    try {
        await chatService.delete(id)
        await bot.sendMessage(id, 'Ok, I will not notify you anymore.')
        await bot.sendMessage(id, 'Do not forget to type /subscribe if you want to re-enable notifications!')
        logger.info(`Chat ${id} unsubscribed.`)
    } catch (error) {
        logger.error(error, `Something went wrong while unsubscribing chat ${id}.`)
    }
}
