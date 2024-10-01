import TelegramService from '../services/TelegramService'

import chatService from '../services/ChatService'
import snkrsService from '../services/SNKRSService'
import upcomingItemService from '../services/UpcomingItemService'

import logger from '../utils/logger'

import { INTERVAL, PRODUCT_TYPES } from '../utils/constants'

// check for new upcoming items every minute
export default (telegramService: TelegramService) => {
    setInterval(async () => {
        try {
            const chats = await chatService.findAll()
            if (!chats.length) return
            // retrieve all upcoming shoes
            const upcomingItems = await snkrsService.getUpcomingItems()
            for (const item of upcomingItems) {
                // check if it's footwear
                if (!PRODUCT_TYPES[item.products[0].product_type]) continue
                // check if the item already exists in the database
                if (await upcomingItemService.exists(item)) continue
                // store the item in the database
                const ui = await upcomingItemService.create(item)
                // send the item to all chats
                await telegramService.sendUpcomingItem(ui, chats)
            }
        } catch (error) {
            logger.error(error)
        }
    }, INTERVAL)
}
