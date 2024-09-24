import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    // if the user is already subscribed, there is no need to send the welcome message
    if (await chatService.exists(id)) return

    // welcome the user and ask to subscribe
    try {
        await bot.sendMessage(id, `Hi! 👋🏻`)
        await bot.sendMessage(id, 'If you are here, it means you want to know when new drops are happening!')
        await bot.sendMessage(id, 'I will keep an eye on Shock Drops and upcoming releases for you.')
        await bot.sendMessage(id, 'I will do my best to notify you, so you can open the SNKRS app and try to cop some heat! 🔥')
        await bot.sendMessage(id, 'To subscribe, type /subscribe.')
    } catch (error) {
        logger.error(`Something went wrong while welcoming chat ${ id }: ${error}`)
    }
}
