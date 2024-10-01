import TelegramService from '../services/TelegramService'

import chatService from '../services/ChatService'
import snkrsService from '../services/SNKRSService'
import feedItemService from '../services/FeedItemService'

import logger from '../utils/logger'

import { FEED_ITEM_TYPES, INTERVAL } from '../utils/constants'

// check for new passes etc. in feed every minute
export default (telegramService: TelegramService) => {
    setInterval(async () => {
        try {
            const chats = await chatService.findAll()
            if (!chats.length) return
            // retrieve all feed items
            const feedItems = await snkrsService.getFeedItems()
            for (const item of feedItems) {
                // check if it's a pass
                if (!FEED_ITEM_TYPES[item.type]) continue
                // check if the item already exists in the database
                if (await feedItemService.exists(item)) continue
                // store the item in the database
                const fi = await feedItemService.create(item)
                // send the item to all chats
                await telegramService.sendFeedItem(fi, chats)
            }
        } catch (error) {
            logger.error(error)
        }
    }, INTERVAL)
}
