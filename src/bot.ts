import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'

import logger from './utils/logger'
import chatRepository from './repositories/ChatRepository'
import httpClient from './utils/HttpClient'

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token!, { polling: true })

bot.onText(/\/start/, start(bot))

bot.onText(/\/subscribe/, subscribe(bot))

bot.onText(/\/unsubscribe/, unsubscribe(bot))

bot.onText(/\/status/, status(bot))

bot.onText(/\/help/, help(bot))

setInterval(async () => {
    try {
        // fetch all active chats
        const chats = await chatRepository.findAll()
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
}, 60000 * 5) // check every 5 minutes
