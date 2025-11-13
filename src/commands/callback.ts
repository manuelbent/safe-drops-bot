import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'
import marketService from '../services/MarketService'

const callbacks = {
    subscribe: async (bot: TelegramBot, query: CallbackQuery) => {
        const marketId = parseInt(query.data!.split('_')[1])
        await chatService.create(query.message!.chat, marketId)
        const market = await marketService.findById(marketId)
        if (!market) {
            logger.error(`Market with ID ${marketId} not found.`)
            await bot.answerCallbackQuery(query.id, {
                text: 'Sorry, something went wrong. Please try again later.',
                show_alert: true
            })
            return
        }

        await bot.answerCallbackQuery(query.id)
        await bot.editMessageText(
            `Alright! I'll keep an eye on the ${market.adjective} market for you. 😎`,
            {
                chat_id: query.message!.chat.id,
                message_id: query.message?.message_id
            }
        )
        logger.info(`Chat ${query.message!.chat.id} subscribed to market ${marketId}.`)
    }
}

export default (bot: TelegramBot) => async (query: CallbackQuery) => {
    const id = query.message?.chat.id
    if (!id) {
        return
    }

    try {
        if (!query.data) {
            return
        }

        const [func] = query.data.split('_')

        if (func in callbacks) {
            await callbacks[func as keyof typeof callbacks](bot, query)
        } else {
            logger.warn(`Unknown callback: ${func}`)
        }
    } catch (error) {
        logger.error(error, `Something went wrong while handling callback for chat ${id}.`)
        await bot.answerCallbackQuery(query.id, {
            text: 'Sorry, something went wrong. Please try again later.',
            show_alert: true
        })
    }
}
