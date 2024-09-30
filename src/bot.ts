import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'

import feedItems from './monitors/feedItems'
import upcomingItems from './monitors/upcomingItems'

// initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true })

// define commands
bot.onText(/\/start/, start(bot))
bot.onText(/\/subscribe/, subscribe(bot))
bot.onText(/\/unsubscribe/, unsubscribe(bot))
bot.onText(/\/status/, status(bot))
bot.onText(/\/help/, help(bot))

// start monitors
feedItems(bot)
upcomingItems(bot)
