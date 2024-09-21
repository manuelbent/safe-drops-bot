import axios, { Axios } from 'axios'

import { _exec } from './commands'

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
                    await new Promise(resolve => setTimeout(resolve, 10000))
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
}

export default new HttpClient()
