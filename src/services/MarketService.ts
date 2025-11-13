import Market from '../models/Market'

import marketRepository from '../repositories/MarketRepository'

/**
 * @class MarketService
 */
class MarketService {
    async findAll(): Promise<Market[]> {
        return marketRepository.findAll()
    }

    async findById(id: number): Promise<Market | null> {
        return marketRepository.findById(id)
    }
}

export default new MarketService()
