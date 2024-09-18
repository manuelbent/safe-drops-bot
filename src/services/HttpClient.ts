import axios, { Axios } from 'axios'

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
        const { data } = await this.client.get('/feed')
        return JSON.stringify(data).toLowerCase()
    }

    async isAlive(): Promise<any> {
        try {
            return !!await this.client.get('/feed')
        } catch (_) {
            return false
        }
    }
}

export default new HttpClient()
