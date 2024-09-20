import axios, { Axios, AxiosResponse } from 'axios'

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
        let { data: { items, pagination: { next: { href } } } }: AxiosResponse<FeedResponse> = await this.client.get('/feed')
        // paginate as long as pagination.next.href has something
        while (href) {
            const { data }: AxiosResponse<FeedResponse> = await this.client.get(href)
            items.push(data.items)
            href = data.pagination.next.href
        }
        return JSON.stringify(items)
    }
}

export default new HttpClient()
