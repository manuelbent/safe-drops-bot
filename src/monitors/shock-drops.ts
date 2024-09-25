import TelegramBot from 'node-telegram-bot-api'

import chatService from '../services/ChatService'
import httpClient from '../utils/HttpClient'
import logger from '../utils/logger'

// check for a shock drop every minute
export default (bot: TelegramBot) => {
    setInterval(async () => {
        try {
            const chats = await chatService.findAll()
            if (!chats.length) return

            const feed = await httpClient.getFeed()
            if (!feed.match(/shock/gi)) return

            for (const { id } of chats) {
                await bot.sendMessage(id, 'It smells like a SHOCK DROP! 🚨 Open the SNKRS app now!')
                await bot.sendMessage(id, 'Remember to /unsubscribe to stop receiving notifications.')
            }
        } catch (error) {
            logger.error(error)
        }
    }, 60000)
}
