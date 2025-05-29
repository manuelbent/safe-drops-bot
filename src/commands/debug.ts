import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message, match: RegExpExecArray|null) => {
    if (!match) return
    try {
        logger.level = match[1] === 'on' ? 'debug' : 'info'
        await bot.sendMessage(id, `Debug mode is now ${match[1]}.`)
    } catch (error) {
        logger.error(`Something went wrong while toggling debug mode: ${error}`)
    }
}
