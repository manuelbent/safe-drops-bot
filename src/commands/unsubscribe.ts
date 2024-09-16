import TelegramBot, { Message } from 'node-telegram-bot-api'

import cache from '../datastore/Cache'

export default (bot: TelegramBot) => async ({ chat: { id } }: Message) => {
    if (cache.subscriptions.has(id)) {
        try {
            cache.subscriptions.delete(id)
            await bot.sendMessage(id, 'Ok, I will not notify you anymore.')
            await bot.sendMessage(id, 'Do not forget to type /subscribe if you want to re-enable notifications!')
        } catch (error) {
            console.log(error)
        }
    }
}
