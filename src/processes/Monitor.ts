import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'

import TelegramService from '../services/TelegramService'
import Market from '../models/Market'

import vpnService from '../services/VPNService'
import chatService from '../services/ChatService'
import feedItemService from '../services/FeedItemService'
import ocrSpaceService from '../services/OCRSpaceService'
import upcomingItemService from '../services/UpcomingItemService'

import { sleep } from '../utils/commands'
import { USER_AGENT, INTERVAL, PRODUCT_TYPES, PRODUCT_CARD, PASS_CARD } from '../utils/constants'

import logger from '../utils/logger'

/**
 * @class Monitor
 * @description Monitor class for tracking SNKRS items per market.
 */
class Monitor {
    private readonly market: Market
    private readonly telegramService: TelegramService
    private readonly client: AxiosInstance

    /**
     * @constructor
     * @param {Market} market - The market to monitor
     * @param {TelegramService} telegramService - The Telegram service instance
     */
    constructor(market: Market, telegramService: TelegramService) {
        this.market = market
        this.telegramService = telegramService

        // Create axios client for this market
        this.client = axios.create({
            baseURL: market.apiUrl,
            headers: { 'User-Agent': USER_AGENT }
        })

        // Setup response interceptor
        this.client.interceptors.response.use(
            response => response,
            async error => {
                if (error.response && error.response.status === 403) {
                    await vpnService.restart()
                    return axios(error.config)
                }
                return Promise.reject(error)
            }
        )

        // Setup retry logic
        axiosRetry(this.client, {
            retries: 1,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error: AxiosError) => {
                return axiosRetry.isNetworkOrIdempotentRequestError(error)
            }
        })

        logger.info(`Monitor initialized for market: ${this.market.label} (${this.market.code})`)
    }

    /**
     * @method start
     * @description Start all monitoring intervals
     */
    start(): void {
        this.startUpcomingItemsMonitor()
        this.startShockDropsMonitor()
        this.startPassesMonitor()
        logger.info(`Monitor started for market: ${this.market.label} (${this.market.code})`)
    }

    /**
     * @method startUpcomingItemsMonitor
     * @description Monitor for new upcoming items
     * @private
     */
    private startUpcomingItemsMonitor(): void {
        setInterval(async () => {
            try {
                const chats = await chatService.findByMarketId(this.market.id)
                if (!chats.length) return

                // Retrieve all upcoming items
                const upcomingItems = await this.getUpcomingItems()

                for (const item of upcomingItems) {
                    // Check if it's footwear
                    if (!PRODUCT_TYPES.has(item.products[0].product_type)) continue
                    // Check if the item already exists in the database
                    if (await upcomingItemService.exists(item)) continue
                    // Store the item in the database
                    const ui = await upcomingItemService.create(item)
                    // Send the item to all chats
                    await this.telegramService.sendUpcomingItem(ui, chats)
                }
            } catch (error) {
                logger.error(error, `Error in upcoming items monitor for ${this.market.code}`)
            }
        }, INTERVAL)
    }

    /**
     * @method startShockDropsMonitor
     * @description Monitor for new shock drops
     * @private
     */
    private startShockDropsMonitor(): void {
        setInterval(async () => {
            try {
                const chats = await chatService.findByMarketId(this.market.id)
                if (!chats.length) return

                // Retrieve all feed items
                const feedItems = await this.getFeedItems()

                for (const item of feedItems) {
                    // Check if it's a product card
                    if (item.type !== PRODUCT_CARD) continue
                    // Check if the item already exists in the database
                    if (await feedItemService.exists(item)) continue
                    // Store the item in the database
                    const fi = await feedItemService.create(item)
                    // Parse the image and extract text
                    const text = await ocrSpaceService.parseImage(fi.imgURL)
                    // If the text does not contain "shock", skip
                    if (!text.match(/shock/gi)) continue
                    // Send the item to all chats
                    await this.telegramService.sendShockDropCard(fi, chats)
                }
            } catch (error) {
                logger.error(error, `Error in shock drops monitor for ${this.market.code}`)
            }
        }, INTERVAL)
    }

    /**
     * @method startPassesMonitor
     * @description Monitor for new passes
     * @private
     */
    private startPassesMonitor(): void {
        setInterval(async () => {
            try {
                const chats = await chatService.findByMarketId(this.market.id)
                if (!chats.length) return

                // Retrieve all feed items
                const feedItems = await this.getFeedItems()

                for (const item of feedItems) {
                    // Check if it's a pass card
                    if (item.type !== PASS_CARD) continue
                    // Check if the item already exists in the database
                    if (await feedItemService.exists(item)) continue
                    // Store the item in the database
                    const fi = await feedItemService.create(item)
                    // Send the item to all chats
                    await this.telegramService.sendPassCard(fi, chats)
                }
            } catch (error) {
                logger.error(error, `Error in passes monitor for ${this.market.code}`)
            }
        }, INTERVAL)
    }

    /**
     * @method getUpcomingItems
     * @description Fetch the upcoming items from the SNKRS APIs.
     * @returns {Promise<NikeUpcomingItem[]>}
     * @private
     */
    private async getUpcomingItems(): Promise<NikeUpcomingItem[]> {
        const items: NikeUpcomingItem[] = []
        let path = '/upcoming'
        do {
            const { data } = await this.client.get(path)
            items.push(...data.items)
            path = data.pagination.next.href
            await sleep(1)
        } while (path)
        return items
    }

    /**
     * @method getFeedItems
     * @description Fetch the feed items from the SNKRS APIs.
     * @returns {Promise<NikeFeedItem[]>}
     * @private
     */
    private async getFeedItems(): Promise<NikeFeedItem[]> {
        const { data: { items } }: AxiosResponse<{ items: NikeFeedItem[] }> = await this.client.get('/feed')
        return items
    }

    /**
     * @method test
     * @description Check if the SNKRS APIs are reachable for this market.
     * @returns {Promise<void>}
     */
    async test(): Promise<void> {
        await this.client.get('/feed')
        logger.info(`API test successful for market: ${this.market.label} (${this.market.code})`)
    }
}

export default Monitor
