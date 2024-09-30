import FeedItem from '../models/FeedItem'

import feedItemRepository from '../repositories/FeedItemRepository'

class FeedItemService {
    async create(data: NikeFeedItem): Promise<FeedItem> {
        return feedItemRepository.create({
            type: data.type,
            title: data.title,
            imgURL: data.cover_card.square_image.url,
            styleColor: data.products?.[0].style_color,
            reserveStart: data.reserve_start,
            reserveEnd: data.reserve_end,
        })
    }

    async exists(item: NikeFeedItem): Promise<boolean> {
        return !!(await feedItemRepository.findBy({
            title: item.title,
            type: item.type,
        })).length
    }
}

export default new FeedItemService()
