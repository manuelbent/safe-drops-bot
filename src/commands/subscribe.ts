import TelegramBot, { Message } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'
import marketService from '../services/MarketService'

export default (bot: TelegramBot) => async ({ chat }: Message) => {
    // if the chat is already subscribed, there is no need to subscribe again
    if (await chatService.exists(chat.id)) {
        await bot.sendMessage(chat.id, 'You are already subscribed! 🙂‍↕️')
        await bot.sendMessage(chat.id, 'Use /unsubscribe if you have changed your mind.')
        return
    }

    try {
        // load available markets
        const markets = await marketService.findAll()

        if (markets.length === 0) {
            await bot.sendMessage(chat.id, 'Sorry, no markets are available at the moment.')
            return
        }

        await bot.sendMessage(chat.id, 'Nice. 🙂‍↕️')

        // create inline keyboard with market options
        const markup = {
            inline_keyboard: markets.map(({ emoji, label, id }) => ([
                {
                    text: `${emoji} ${label}`,
                    callback_data: `subscribe_${id}`
                }
            ]))
        }

        await bot.sendMessage(
            chat.id,
            'What market are you interested in?',
            { reply_markup: markup }
        )
    } catch (error) {
        logger.error(error, `Something went wrong while loading markets for chat ${chat.id}.`)
        await bot.sendMessage(chat.id, 'Sorry, something went wrong. Please try again later.')
    }
}
