import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'
import snkrsService from '../services/SNKRSService'
import ocrSpaceService from '../services/OCRSpaceService'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    // if it's not the admin chat, return
    if (id !== Number(process.env.ADMIN_CHAT)) {
        return
    }

    try {
        await bot.sendMessage(id, `subscription: ${await chatService.exists(id) ? 'active' : 'inactive'}`)
        await bot.sendMessage(id, 'monitoring: ' + await snkrsService.test().then(() => 'operational').catch((error) => {
            logger.error(error, 'Could not reach SNRKS /feed.')
            return 'down'
        }))
        await bot.sendMessage(id, 'parsing: ' + await ocrSpaceService.test().then(() => 'operational').catch((error) => {
            logger.error(error, 'Could not reach OCR Space.')
            return 'down'
        }))
    } catch (error) {
        logger.error(error, `Something went wrong with chat ${id} status request.`)
    }
}
