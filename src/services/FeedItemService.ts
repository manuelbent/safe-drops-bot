import FeedItem from '../models/FeedItem'

import feedItemRepository from '../repositories/FeedItemRepository'

/**
 * @class FeedItemService
 */
class FeedItemService {
    /**
     * @description Store a new feed item in the database.
     * @param {NikeFeedItem} item
     * @returns {Promise<FeedItem>}
     */
    async create(item: NikeFeedItem): Promise<FeedItem> {
        return feedItemRepository.create({
            hashKey: item.analytics.hash_key,
            type: item.type,
            title: item.title,
            imgURL: item.cover_card.square_image?.url ?? item.cover_card.portrait_image?.url,
            validDate: item.valid_date,
            effectiveStartSellDate: item.effective_start_sell_date,
            reserveStart: item.reserve_start,
            reserveEnd: item.reserve_end,
        })
    }

    /**
     * @description Check if a feed item already exists in the database.
     * @param {NikeFeedItem} item
     * @returns {Promise<boolean>}
     */
    async exists(item: NikeFeedItem): Promise<boolean> {
        return !!(await feedItemRepository.findBy({ hashKey: item.analytics.hash_key })).length
    }
}

export default new FeedItemService()
