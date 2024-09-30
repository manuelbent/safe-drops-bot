import axios, { AxiosError, AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import { exec, sleep } from '../utils/commands'

import logger from '../utils/logger'

/**
 * @class SNKRSService
 * @description Service to interact with the SNKRS APIs.
 */
class SNKRSService {
    /**
     * @property {AxiosInstance} client
     * @private
     */
    private readonly client: AxiosInstance

    /**
     * @constructor
     */
    constructor() {
        this.client = axios.create({
            baseURL: 'https://snkrs.services.nike.com/snkrs/content/v2/user/app/IT/it',
            headers: {
                'User-Agent': 'PostmanRuntime/7.26.8',
            }
        })

        this.client.interceptors.response.use(
            response => response,
            async error => {
                if (error.response && error.response.status === 403) {
                    logger.warn('403 detected, restarting VPN...')
                    await exec('pm2 restart ovpn')
                    await sleep(10)
                    logger.warn('VPN restarted')
                    return axios(error.config)
                }
                return Promise.reject(error)
            }
        )

        axiosRetry(this.client, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error: AxiosError) => {
                return axiosRetry.isNetworkOrIdempotentRequestError(error)
            }
        })
    }

    /**
     * @method test
     * @description Check if the SNKRS APIs are reachable.
     */
    async test(): Promise<void> {
        await this.client.get('/feed')
    }

    /**
     * @method getFeedItems
     * @description Fetch the feed items from the SNKRS APIs.
     */
    async getFeedItems(): Promise<NikeFeedItem[]> {
        const { data: { items } } = await this.client.get('/feed')
        return items.filter(({ type }: NikeFeedItem) => type === 'product-card' || type === 'pass-card')
    }

    /**
     * @method getUpcomingItems
     * @description Fetch the upcoming items from the SNKRS APIs.
     */
    async getUpcomingItems(): Promise<NikeUpcomingItem[]> {
        const items: NikeUpcomingItem[] = []
        let path = '/upcoming'
        do {
            const { data } = await this.client.get(path)
            items.push(...data.items)
            path = data.pagination.next.href
            await sleep(1)
        } while (path)
        return items.filter(({ products }) => products[0].product_type === 'FOOTWEAR')
    }
}

export default new SNKRSService()
