import axios, { Axios } from 'axios'

class HttpClient {
    private client: Axios

    constructor() {
        this.client = axios.create({ baseURL: 'https://snkrs.services.nike.com/snkrs/content/v2/user/app/IT/it' })
    }

    async getFeed(): Promise<string> {
        const { data } = await this.client.get('/feed', {
            headers: {
                'User-Agent': 'PostmanRuntime/7.26.8',
            }
        })
        return JSON.stringify(data).toLowerCase()
    }
}

export default new HttpClient()
