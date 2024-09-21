import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import httpClient from '../utils/HttpClient'
import chatRepository from '../repositories/ChatRepository'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, `subscription: ${ await chatRepository.findById(id) ? 'active' : 'inactive' }`)
        await bot.sendMessage(id, 'monitoring: ' + await httpClient.getFeed().then(() => 'operational').catch(() => 'down'))
    } catch (error) {
        logger.error(`Something went wrong with chat ${ id } status request: ${error}`)
    }
}
