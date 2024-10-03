import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'
import snkrsService from '../services/SNKRSService'
import ocrSpaceService from '../services/OCRSpaceService'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    try {
        await bot.sendMessage(id, `subscription: ${ await chatService.exists(id) ? 'active' : 'inactive' }`)
        await bot.sendMessage(id, 'monitoring: ' + await snkrsService.test().then(() => 'operational').catch(() => 'down'))
        await bot.sendMessage(id, 'parsing: ' + await ocrSpaceService.test().then(() => 'operational').catch(() => 'down'))
    } catch (error) {
        logger.error(`Something went wrong with chat ${ id } status request: ${error}`)
    }
}
