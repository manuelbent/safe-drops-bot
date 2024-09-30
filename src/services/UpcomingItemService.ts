import UpcomingItem from '../models/UpcomingItem'

import upcomingItemRepository from '../repositories/UpcomingItemRepository'

/**
 * @class UpcomingItemService
 */
class UpcomingItemService {
    /**
     * @description Store a new upcoming item in the database.
     * @param {NikeUpcomingItem} data
     * @returns {Promise<UpcomingItem>}
     */
    async create(data: NikeUpcomingItem): Promise<UpcomingItem> {
        return upcomingItemRepository.create({
            title: data.cover_card.title,
            subtitle: data.cover_card.subtitle,
            effectiveStartSellDate: data.effective_start_sell_date,
            imgURL: data.products[0].assets.find(({ view }) => view === 'pair_image')!.url,
            deeplink: `snkrs://product/${data.products[0].style_color}`
        })
    }

    /**
     * @description Check if an upcoming item already exists in the database.
     * @param {NikeUpcomingItem} item
     * @returns {Promise<boolean>}
     */
    async exists(item: NikeUpcomingItem): Promise<boolean> {
        return !!(await upcomingItemRepository.findBy({
            title: item.cover_card.title,
            effectiveStartSellDate: item.effective_start_sell_date
        })).length
    }
}

export default new UpcomingItemService()
