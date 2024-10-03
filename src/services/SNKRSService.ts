import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'

import { exec, sleep } from '../utils/commands'
import { SNKRS_API_BASE_URL, USER_AGENT } from '../utils/constants'

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
        this.client = axios.create({ baseURL: SNKRS_API_BASE_URL, headers: { 'User-Agent': USER_AGENT } })

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
     * @returns {Promise<void>}
     */
    async test(): Promise<void> {
        await this.client.get('/feed')
    }

    /**
     * @method getUpcomingItems
     * @description Fetch the upcoming items from the SNKRS APIs.
     * @returns {Promise<NikeUpcomingItem[]>}
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
        return items
    }

    /**
     * @method getFeedItems
     * @description Fetch the feed items from the SNKRS APIs.
     * @returns {Promise<NikeFeedItem[]>}
     */
    async getFeedItems(): Promise<NikeFeedItem[]> {
        const { data: { items } }: AxiosResponse<{ items: NikeFeedItem[] }> = await this.client.get('/feed')
        return items
    }
}

export default new SNKRSService()
