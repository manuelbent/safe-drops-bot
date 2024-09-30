import TelegramBot from 'node-telegram-bot-api'

import Chat from '../models/Chat'
import UpcomingItem from '../models/UpcomingItem'
import FeedItem from '../models/FeedItem'

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
            deeplink: `<a href="https://redirect.prizzle.dev/?url=${ui.deeplink}">View on SNKRS</a>`,
        }
        const caption = Object.values(details).filter(Boolean).reduce((acc, curr) => `${acc}\n${curr}`)
        for (const { id } of chats) {
            await this.bot.sendPhoto(id, ui.imgURL, { caption, parse_mode: 'HTML' })
        }
    }

    /**
     * @method sendFeedItem
     * @param {FeedItem} fi
     * @param {Chat[]} chats
     * @returns {Promise<void>}
     */
    async sendFeedItem(fi: FeedItem, chats: Chat[]): Promise<void> {
        const details = {} as Record<string, string>
        if (fi.type === 'pass-card') {
            details.title = `<b>${fi.title}</b>`
            details.start = `from: ${fi.reserveStart!.toLocaleString()} (UTC)`
            details.end = `to: ${fi.reserveEnd!.toLocaleString()} (UTC)`
            details.deeplink = `<a href="https://redirect.prizzle.dev/?url=snkrs://product/${fi.styleColor}">View on SNKRS</a>`
        }
        if (fi.type === 'product-card') {
            details.date = `${fi.effectiveStartSellDate!.toLocaleString()} (UTC)`
            details.title = `<b>${fi.title}</b>`
            details.deeplink = `<a href="https://redirect.prizzle.dev/?url=snkrs://product/${fi.styleColor}">View on SNKRS</a>`
        }
        const caption = Object.values(details).filter(Boolean).reduce((acc, curr) => `${acc}\n${curr}`)
        for (const { id } of chats) {
            await this.bot.sendPhoto(id, fi.imgURL, { caption, parse_mode: 'HTML' })
        }
    }
}

export default TelegramService
