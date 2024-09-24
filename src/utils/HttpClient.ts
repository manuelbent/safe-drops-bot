import axios, { Axios } from 'axios'

import { _exec, sleep } from './commands'

class HttpClient {
    private client: Axios

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
                    await _exec('pm2 restart ovpn')
                    await sleep(10)
                    return axios(error.config)
                }
                return Promise.reject(error)
            }
        )
    }

    async getFeed(): Promise<string> {
        const { data } = await this.client.get('/feed')
        return JSON.stringify(data)
    }

    async getUpcoming(): Promise<NikeUpcomingItem[]> {
        const items = []
        let path = '/upcoming'
        do {
            const { data } = await this.client.get(path)
            items.push(...data.items)
            path = data.pagination.next.href
            await sleep(1)
        } while (path)
        return items
    }
}

export default new HttpClient()
