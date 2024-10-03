import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'

import { OCR_SPACE_BASE_URL } from '../utils/constants'

/**
 * @class OCRSpaceService
 */
class OCRSpaceService {
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
            baseURL: OCR_SPACE_BASE_URL,
            headers: {
                apikey: process.env.OCR_SPACE_API_KEY
            }
        })

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
     * @description Check if the OCR Space APIs are reachable.
     * @returns {Promise<void>}
     */
    async test(): Promise<void> {
        await this.client.post('/')
    }

    /**
     * @method parseImage
     * @param {string} url
     * @returns {Promise<string>}
     */
    async parseImage(url: string): Promise<string> {
        const formData = new FormData()
        formData.append('url', url)
        formData.append('language', 'eng')
        formData.append('FileType', '.Auto')
        formData.append('OCREngine', '2')
        const { data }: AxiosResponse<OCRSpaceResponse> = await this.client.post('/', formData)
        return data.ParsedResults[0].ParsedText
    }
}

export default new OCRSpaceService()
