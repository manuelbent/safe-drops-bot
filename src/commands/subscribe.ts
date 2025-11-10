import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'
import marketService from '../services/MarketService'

export default (bot: TelegramBot) => async ({ chat }: Message) => {
    // if the chat is already subscribed, there is no need to subscribe again
    if (await chatService.exists(chat.id)) return

    try {
        // load available markets
        const markets = await marketService.findAll()

        if (markets.length === 0) {
            await bot.sendMessage(chat.id, 'Sorry, no markets are available at the moment.')
            return
        }

        // create inline keyboard with market options
        const keyboard = {
            inline_keyboard: markets.map(market => ([
                { text: `${market.emoji} ${market.label}`, callback_data: `subscribe_${market.id}` }
            ]))
        }

        await bot.sendMessage(
            chat.id,
            'Please choose your market:',
            { reply_markup: keyboard }
        )
    } catch (error) {
        logger.error(error, `Something went wrong while loading markets for chat ${chat.id}.`)
        await bot.sendMessage(chat.id, 'Sorry, something went wrong. Please try again later.')
    }
}
