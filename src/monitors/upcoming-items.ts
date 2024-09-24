import TelegramBot from 'node-telegram-bot-api'

import chatService from '../services/ChatService'
import httpClient from '../utils/HttpClient'
import upcomingItemService from '../services/UpcomingItemService'
import logger from '../utils/logger'

// check for new upcoming items every 5 minutes
export default (bot: TelegramBot) => {
    setInterval(async () => {
        try {
            const chats = await chatService.findAll()
            if (!chats.length) {
                return
            }

            const upcomingItems = await httpClient.getUpcomingItems()
            for (const item of upcomingItems) {
                if (await upcomingItemService.exists(item)) {
                    continue
                }

                const ui = await upcomingItemService.create(item)
                const details = {
                    date: `${ui.effectiveStartSellDate.toLocaleString()} (UTC)`,
                    subtitle: ui.subtitle,
                    title: `<b>${ui.title}</b>`,
                    deeplink: `<a href="https://redirect.prizzle.dev/?url=${ui.deeplink}">View on SNKRS</a>`,
                }
                const caption = Object.values(details).reduce((acc, curr) => `${acc}\n${curr}`)

                for (const { id } of chats) {
                    await bot.sendPhoto(id, ui.imgURL, { caption, parse_mode: 'HTML' })
                }
            }
        } catch (error) {
            logger.error(error)
        }
    }, 3000)
}
