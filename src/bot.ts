import TelegramBot from 'node-telegram-bot-api'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'
import debug from './commands/debug'

import passes from './monitors/passes'
import shockDrops from './monitors/shockDrops'
import upcomingItems from './monitors/upcomingItems'
import healthcheck from './monitors/healthcheck'

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
bot.onText(/\/debug:(on|off)/, debug(bot))

// start monitors
passes(telegramService)
shockDrops(telegramService)
upcomingItems(telegramService)

// start healthcheck
healthcheck()
