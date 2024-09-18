import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import cache from '../datastore/Cache'

export default (bot: TelegramBot) => async ({ chat: { id, first_name } }: Message) => {
    // if the user is already subscribed, there is no need to send the welcome message
    if (cache.subscriptions.has(id)) return

    // welcome the user and ask to subscribe
    try {
        await bot.sendMessage(id, `Hi, ${ first_name }!`)
        await bot.sendMessage(id, 'If you are here, it means you want to know when a SHOCK DROP is happening!')
        await bot.sendMessage(id, 'I will do my best to notify you, so you can open the SNKRS app and try to cop some heat! 🔥')
        await bot.sendMessage(id, 'To subscribe, type /subscribe.')
    } catch (error) {
        logger.error(`Something went wrong while welcoming chat ${ id }`, error)
    }
}
