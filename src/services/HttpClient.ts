import axios, { Axios } from 'axios'

import logger from '../utils/logger'

class HttpClient {
    private client: Axios

    constructor() {
        this.client = axios.create({
            baseURL: 'https://snkrs.services.nike.com/snkrs/content/v2/user/app/IT/it',
            headers: {
                'User-Agent': 'PostmanRuntime/7.26.8',
            }
        })
    }

    async getFeed(): Promise<string> {
        const { data, status } = await this.client.get('/feed')
        logger.info(`${ status } GET /feed`)
        return JSON.stringify(data)
    }

    async getUpcoming(): Promise<string> {
        const { data, status } = await this.client.get('/upcoming')
        logger.info(`${ status } GET /upcoming`)
        return JSON.stringify(data)
    }
}

export default new HttpClient()
