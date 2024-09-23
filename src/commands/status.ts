import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import httpClient from '../utils/HttpClient'
import chatService from '../services/ChatService'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, `subscription: ${ await chatService.exists(id) ? 'active' : 'inactive' }`)
        await bot.sendMessage(id, 'monitoring: ' + await httpClient.getFeed().then(() => 'operational').catch(() => 'down'))
    } catch (error) {
        logger.error(`Something went wrong with chat ${ id } status request: ${error}`)
    }
}
