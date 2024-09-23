import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'

import logger from './utils/logger'
import httpClient from './utils/HttpClient'
import chatService from './services/ChatService'
import releaseService from './services/ReleaseService'

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
        // fetch all active chats
        const chats = await chatService.findAll()
        // if there are no subscriptions, there is no need to check for a shock drop
        if (!chats.length) return
        // fetch the feed from Nike APIs
        const feed = await httpClient.getFeed()
        // if the feed does not contain the word 'shock', do nothing
        if (!feed.match(/shock/gi)) return
        // notify the subscribers
        for (const { id } of chats) {
            await bot.sendMessage(id, 'It smells like a SHOCK DROP! 🚨 Open the SNKRS app now!')
            await bot.sendMessage(id, 'Remember to /unsubscribe to stop receiving notifications.')
        }
    } catch (error) {
        logger.error(error)
    }
}, 60000) // check every minute

// check for a new upcoming releases every 5 minutes
setInterval(async () => {
    try {
        // fetch all active chats
        const chats = await chatService.findAll()
        // if there are no subscriptions, there is no need to check for a new upcoming releases
        if (!chats.length) return
        // fetch the upcoming releases from Nike APIs
        const upcoming = await httpClient.getUpcoming()
        for (const item of upcoming) {
            // if the release already exists in the database, skip it
            if (await releaseService.exists(item)) continue
            // create the release in the database
            const { title, subtitle, effective_start_sell_date, img_url } = await releaseService.create(item)
            // notify the subscribers
            for (const { id } of chats) {
                const caption = `${effective_start_sell_date.toLocaleString('it-IT')}\n${subtitle}\n<b>${title}</b>`
                await bot.sendPhoto(id, img_url, { caption, parse_mode: 'HTML' })
            }
        }
    } catch (error) {
        logger.error(error)
    }
}, 60000 * 5)
