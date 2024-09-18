import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'

export default (bot: TelegramBot) => async ({ chat: { id, first_name } }: Message) => {
    try {
        await bot.sendMessage(id, `Don't panic, ${ first_name }. Everything is going to be alright.`)
        const helpMessage = `
            *Here are the available commands:*
            /start - Start interacting with the bot
            /subscribe - Subscribe to notifications
            /unsubscribe - Unsubscribe from notifications
            /status - Check your subscription and the bot status
            /help - Show this help message
        `
        await bot.sendMessage(id, helpMessage, { parse_mode: 'Markdown' })
    } catch (error) {
        logger.error(`Something went wrong while helping chat ${ id }`, error)
    }
}
