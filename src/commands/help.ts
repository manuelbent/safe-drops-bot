import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'

export default (bot: TelegramBot) => async ({ chat: { id, first_name } }: Message) => {
    try {
        await bot.sendMessage(id, `Don't panic, ${ first_name }.`)
        await bot.sendMessage(id, 'Everything is going to be alright.')
        await bot.sendMessage(id, 'Here are the commands you can use:')
        const commands = [
            { command: '/start', description: 'Start interacting with the bot' },
            { command: '/subscribe', description: 'Subscribe to notifications' },
            { command: '/unsubscribe', description: 'Unsubscribe from notifications' },
            { command: '/status', description: 'Check your subscription and the bot status' },
            { command: '/help', description: 'Show this help message' },
        ]
        const text = commands.reduce((acc, { command, description }) => `${ acc }${ command } - ${ description }\n`, '')
        await bot.sendMessage(id, text, { parse_mode: 'Markdown' })
    } catch (error) {
        logger.error(`Something went wrong while helping chat ${ id }`, error)
    }
}
