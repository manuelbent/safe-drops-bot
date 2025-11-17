import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import marketService from './MarketService'
import { USER_AGENT } from '../utils/constants'
import logger from '../utils/logger'

/**
 * @class SNKRSService
 * @description Service for testing SNKRS API connectivity across all markets
 */
class SNKRSService {
    /**
     * @method test
     * @description Test if SNKRS APIs are reachable for all markets
     * @returns {Promise<void>}
     * @throws {Error} If any market API is unreachable
     */
    async test(): Promise<void> {
        const markets = await marketService.findAll()

        if (markets.length === 0) {
            throw new Error('No markets found in database')
        }

        // Pick a random market from the markets array
        const market = markets[Math.floor(Math.random() * markets.length)]

        const client: AxiosInstance = axios.create({
            baseURL: market.apiUrl,
            headers: { 'User-Agent': USER_AGENT },
            timeout: 10000
        })

        // Setup retry logic
        axiosRetry(client, {
            retries: 1,
            retryDelay: axiosRetry.exponentialDelay
        })

        try {
            await client.get('/feed')
            logger.debug(`SNKRS API test passed for market: ${market.label} (${market.code})`)
        } catch (error) {
            logger.error(error, `SNKRS API test failed for market: ${market.label} (${market.code})`)
            throw error
        }
    }
}

export default new SNKRSService()
