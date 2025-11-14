import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, `Don't panic, everything is going to be alright.`)
        await bot.sendMessage(id, 'Here are the commands you can use:')
        const commands = [
            { command: '/subscribe', description: 'subscribe to notifications' },
            { command: '/unsubscribe', description: 'unsubscribe from notifications' },
            { command: '/help', description: 'show this help message' },
        ]
        const text = commands.reduce((acc, { command, description }) => `${acc}${command} - ${description}\n`, '')
        await bot.sendMessage(id, text, { parse_mode: 'Markdown' })
        await bot.sendMessage(id, 'Remember, all dates are in UTC. Check your local time zone to properly adjust.')
    } catch (error) {
        logger.error(error, `Something went wrong while helping chat ${id}.`)
    }
}
