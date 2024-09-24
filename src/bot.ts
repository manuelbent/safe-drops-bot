import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'

import shockDrops from './monitors/shock-drops'
import upcomingItems from './monitors/upcoming-items'

// initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true })

// define commands
bot.onText(/\/start/, start(bot))
bot.onText(/\/subscribe/, subscribe(bot))
bot.onText(/\/unsubscribe/, unsubscribe(bot))
bot.onText(/\/status/, status(bot))
bot.onText(/\/help/, help(bot))

// start monitors
shockDrops(bot)
upcomingItems(bot)
