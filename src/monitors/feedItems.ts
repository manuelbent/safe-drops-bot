import TelegramBot from 'node-telegram-bot-api'

import chatService from '../services/ChatService'
import snkrsService from '../services/SNKRSService'
import feedItemService from '../services/FeedItemService'
import logger from '../utils/logger'

// check for new feed items every minute
export default (bot: TelegramBot) => {
    setInterval(async () => {
        try {
            const chats = await chatService.findAll()
            if (!chats.length) return

            const feedItems = await snkrsService.getFeedItems()
            for (const item of feedItems) {
                if (await feedItemService.exists(item)) continue

                const fi = await feedItemService.create(item)
                // create card based on type
            }
        } catch (error) {
            logger.error(error)
        }
    }, 60000)
}
