import FeedItem from '../models/FeedItem'
import BaseRepository from './BaseRepository'

class FeedItemRepository extends BaseRepository<FeedItem> {}

export default new FeedItemRepository(FeedItem)
