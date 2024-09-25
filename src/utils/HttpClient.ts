import axios, { AxiosError, AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import { _exec, sleep } from './commands'
import logger from './logger'

class HttpClient {
    private readonly client: AxiosInstance

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
                    await _exec('pm2 restart ovpn')
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

    async getFeed(): Promise<string> {
        const { data } = await this.client.get('/feed')
        return JSON.stringify(data)
    }

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

export default new HttpClient()
