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
            deeplink: `<a href="https://redirect.prizzle.dev/?url=snkrs://product/${ui.styleColor}">View on SNKRS</a>`,
        }
        const caption = Object.values(details).reduce((acc, curr) => `${acc}\n${curr}`)
        for (const { id } of chats) {
            await this.bot.sendPhoto(id, ui.imgURL, { caption, parse_mode: 'HTML' })
        }
    }

    /**
     * @method sendPassCard
     * @param {FeedItem} fi
     * @param {Chat[]} chats
     * @returns {Promise<void>}
     */
    async sendPassCard(fi: FeedItem, chats: Chat[]): Promise<void> {
        const details = {} as Record<string, string>
        if (fi.effectiveStartSellDate) details.date = `${fi.effectiveStartSellDate.toLocaleString()} (UTC)`
        if (fi.reserveStart) details.from = `from: ${fi.reserveStart.toLocaleString()} (UTC)`
        if (fi.reserveEnd) details.to = `to: ${fi.reserveEnd.toLocaleString()} (UTC)`
        details.title = `<b>${fi.title}</b>`
        const caption = Object.values(details).reduce((acc, curr) => `${acc}\n${curr}`)
        for (const { id } of chats) {
            await this.bot.sendPhoto(id, fi.imgURL, { caption, parse_mode: 'HTML' })
        }
    }

    /**
     * @method sendShockDropCard
     * @param {FeedItem} fi
     * @param {Chat[]} chats
     * @returns {Promise<void>}
     */
    async sendShockDropCard(fi: FeedItem, chats: Chat[]): Promise<void> {
        for (const { id } of chats) {
            await this.bot.sendMessage(id, 'It smells like a shock drop! 🚨')
            await this.bot.sendPhoto(id, fi.imgURL)
            await this.bot.sendMessage(id, 'Check it out on SNKRS now!')
        }
    }
}

export default TelegramService
