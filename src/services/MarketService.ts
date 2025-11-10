import Market from '../models/Market'

import marketRepository from '../repositories/MarketRepository'

/**
 * @class MarketService
 */
class MarketService {
    async findAll(): Promise<Market[]> {
        return marketRepository.findAll()
    }
}

export default new MarketService()
