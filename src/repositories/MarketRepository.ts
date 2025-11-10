import Market from '../models/Market'
import BaseRepository from './BaseRepository'

/**
 * @class MarketRepository
 */
class MarketRepository extends BaseRepository<Market> {}

export default new MarketRepository(Market)

