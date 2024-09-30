import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'

import upcomingItems from './monitors/upcomingItems'

import TelegramService from './services/TelegramService'

// initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true })

// initialize the service
const telegramService = new TelegramService(bot)

// define commands
bot.onText(/\/start/, start(bot))
bot.onText(/\/subscribe/, subscribe(bot))
bot.onText(/\/unsubscribe/, unsubscribe(bot))
bot.onText(/\/status/, status(bot))
bot.onText(/\/help/, help(bot))

// start monitors
upcomingItems(telegramService)
