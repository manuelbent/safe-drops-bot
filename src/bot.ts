import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'

import cache from './datastore/Cache'
import httpClient from './services/HttpClient'

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token!, { polling: true })

bot.onText(/\/start/, start(bot))

bot.onText(/\/subscribe/, subscribe(bot))

bot.onText(/\/unsubscribe/, unsubscribe(bot))

bot.onText(/\/status/, status(bot))

setInterval(async () => {
    try {
        if (!!cache.subscriptions.size) {
            const feed = await httpClient.getFeed()
            if (feed.includes('shock')) {
                for (const id of cache.subscriptions.keys()) {
                    await bot.sendMessage(id, 'It smells like a SHOCK DROP! 🚨 Open the SNKRS app now!')
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}, 3000)
