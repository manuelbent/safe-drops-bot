import TelegramBot from 'node-telegram-bot-api'

import Chat from '../models/Chat'
import UpcomingItem from '../models/UpcomingItem'
import FeedItem from '../models/FeedItem'

import logger from '../utils/logger'

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

        const promises = chats.map(({ id }) =>
            this.bot.sendPhoto(id, ui.imgURL, { caption, parse_mode: 'HTML' }).catch(error => {
                logger.error(error, `Failed to send upcoming item to chat ${id}`)
            }))

        await Promise.all(promises)
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

        const promises = chats.map(({ id }) =>
            this.bot.sendPhoto(id, fi.imgURL, { caption, parse_mode: 'HTML' }).catch(error => {
                logger.error(error, `Failed to send pass card to chat ${id}`)
            }))

        await Promise.all(promises)
    }

    /**
     * @method sendShockDropCard
     * @param {FeedItem} fi
     * @param {Chat[]} chats
     * @returns {Promise<void>}
     */
    async sendShockDropCard(fi: FeedItem, chats: Chat[]): Promise<void> {
        const promises = chats.map(({ id }) => {
                const caption = `<b>Smells like a Shock Drop! 🚨\nHurry up and check it out on SNKRS!</b>`
                this.bot.sendPhoto(id, fi.imgURL, { caption, parse_mode: 'HTML' }).catch(error => {
                    logger.error(error, `Failed to send shock drop card to chat ${id}`)
                })
            }
        )

        await Promise.all(promises)
    }
}

export default TelegramService
