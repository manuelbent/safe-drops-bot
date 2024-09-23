import Release from '../models/Release'

import releaseRepository from '../repositories/ReleaseRepository'

class ReleaseService {
    async create(data: UpcomingItem): Promise<Release> {
        return releaseRepository.create({
            title: data.cover_card.title,
            effective_start_sell_date: data.effective_start_sell_date,
            subtitle: data.cover_card.subtitle,
            img_url: data.cover_card.square_image.url,
            deeplink: `snkrs://product/${data.products[0].style_color}`
        })
    }

    async exists(item: UpcomingItem): Promise<boolean> {
        const releases = await releaseRepository.findBy({
            title: item.cover_card.title,
            effective_start_sell_date: item.effective_start_sell_date
        })
        return releases.length > 0
    }
}

export default new ReleaseService()
