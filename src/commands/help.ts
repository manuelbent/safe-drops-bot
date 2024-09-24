import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, `Don't panic, everything is going to be alright.`)
        await bot.sendMessage(id, 'Here are the commands you can use:')
        const commands = [
            { command: '/start', description: 'start interacting with the bot' },
            { command: '/subscribe', description: 'subscribe to notifications' },
            { command: '/unsubscribe', description: 'unsubscribe from notifications' },
            { command: '/status', description: 'check subscription and bot status' },
            { command: '/help', description: 'show this help message' },
        ]
        const text = commands.reduce((acc, { command, description }) => `${ acc }${ command } - ${ description }\n`, '')
        await bot.sendMessage(id, text, { parse_mode: 'Markdown' })
    } catch (error) {
        logger.error(`Something went wrong while helping chat ${ id }: ${error}`)
    }
}
