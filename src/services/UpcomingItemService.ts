import UpcomingItem from '../models/UpcomingItem'

import upcomingItemRepository from '../repositories/UpcomingItemRepository'

class UpcomingItemService {
    async create(data: NikeUpcomingItem): Promise<UpcomingItem> {
        return upcomingItemRepository.create({
            title: data.cover_card.title,
            subtitle: data.cover_card.subtitle,
            effectiveStartSellDate: data.effective_start_sell_date,
            imgURL: data.cover_card.square_image.url,
            deeplink: `snkrs://product/${data.products[0].style_color}`
        })
    }

    async exists(item: NikeUpcomingItem): Promise<boolean> {
        // rewrite?
        return !!(await upcomingItemRepository.findBy({
            title: item.cover_card.title,
            effectiveStartSellDate: item.effective_start_sell_date
        })).length
    }
}

export default new UpcomingItemService()
