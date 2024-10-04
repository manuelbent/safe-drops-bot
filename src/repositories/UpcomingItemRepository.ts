import UpcomingItem from '../models/UpcomingItem'
import BaseRepository from './BaseRepository'

/**
 * @class UpcomingItemRepository
 */
class UpcomingItemRepository extends BaseRepository<UpcomingItem> {}

export default new UpcomingItemRepository(UpcomingItem)
