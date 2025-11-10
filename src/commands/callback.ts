import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api'

import logger from '../utils/logger'
import chatService from '../services/ChatService'

const callbacks = {
    subscribe: async (bot: TelegramBot, query: CallbackQuery) => {
        const [_, marketId] = query.data!.split('_')
        await chatService.create(query.message!.chat, parseInt(marketId))
        await bot.answerCallbackQuery(query.id)
        await bot.editMessageText(
            `Alright! I'll keep an eye for you. 😎`,
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
