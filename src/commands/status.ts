import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import cache from '../datastore/Cache'
import httpClient from '../services/HttpClient'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, `subscription: ${ cache.subscriptions.has(id) ? 'active' : 'inactive' }`)
        await bot.sendMessage(id, 'monitoring: ' + await httpClient.getFeed().then(() => 'operational').catch(() => 'down'))
    } catch (error) {
        logger.error(`Something went wrong with chat ${ id } status request: ${error}`)
    }
}
