import TelegramBot from 'node-telegram-bot-api'

import Chat from '../models/Chat'
import UpcomingItem from '../models/UpcomingItem'

/**
 * @class TelegramService
 */
class TelegramService {
    /**
     * @property {TelegramBot} bot
     * @private
     */
    private bot: TelegramBot

    /**
     * @constructor
     * @param {TelegramBot} bot
     */
    constructor(bot: TelegramBot) {
        this.bot = bot
    }

    /**
     * @method sendUpcomingItem
     * @param {UpcomingItem} ui
     * @param {Chat[]} chats
     * @returns {Promise<void>}
     */
    async sendUpcomingItem(ui: UpcomingItem, chats: Chat[]): Promise<void> {
        const details = {
            date: `${ui.effectiveStartSellDate.toLocaleString()} (UTC)`,
            subtitle: ui.subtitle,
            title: `<b>${ui.title}</b>`,
            deeplink: `<a href="https://redirect.prizzle.dev/?url=snkrs://product/${ui.styleColor}">View on SNKRS</a>`,
        }
        const caption = Object.values(details).filter(Boolean).reduce((acc, curr) => `${acc}\n${curr}`)
        for (const { id } of chats) {
            await this.bot.sendPhoto(id, ui.imgURL, { caption, parse_mode: 'HTML' })
        }
    }
}

export default TelegramService
