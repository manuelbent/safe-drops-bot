import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'

import logger from './utils/logger'
import httpClient from './utils/HttpClient'
import chatService from './services/ChatService'
import upcomingItemService from './services/UpcomingItemService'

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token!, { polling: true })

bot.onText(/\/start/, start(bot))

bot.onText(/\/subscribe/, subscribe(bot))

bot.onText(/\/unsubscribe/, unsubscribe(bot))

bot.onText(/\/status/, status(bot))

bot.onText(/\/help/, help(bot))

// check for a shock drop every minute
setInterval(async () => {
    try {
        const chats = await chatService.findAll()
        if (!chats.length) {
            return
        }

        const feed = await httpClient.getFeed()
        if (!feed.match(/shock/gi)) {
            return
        }

        for (const { id } of chats) {
            await bot.sendMessage(id, 'It smells like a SHOCK DROP! 🚨 Open the SNKRS app now!')
            await bot.sendMessage(id, 'Remember to /unsubscribe to stop receiving notifications.')
        }
    } catch (error) {
        logger.error(error)
    }
}, 60000)

// check for a new upcoming items every 5 minutes
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
}, 60000 * 5)
