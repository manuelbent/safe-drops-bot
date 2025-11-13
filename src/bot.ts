import TelegramBot from 'node-telegram-bot-api'

import logger from './utils/logger'

import TelegramService from './services/TelegramService'

import start from './commands/start'
import subscribe from './commands/subscribe'
import unsubscribe from './commands/unsubscribe'
import status from './commands/status'
import help from './commands/help'
import debug from './commands/debug'
import callback from './commands/callback'

import { initializeMonitors } from './monitors/initializeMonitors'

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

// handle callbacks
bot.on('callback_query', callback(bot))

// initialize monitors for all markets
initializeMonitors(telegramService).catch(logger.error)
