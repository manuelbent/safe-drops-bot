import Release from '../models/Release'

class ReleaseRepository {
    async create(data: UpcomingItem): Promise<Release> {
        return Release.create({
            title: data.cover_card.title,
            effective_start_sell_date: data.effective_start_sell_date,
            subtitle: data.cover_card.subtitle,
            img_url: data.cover_card.square_image.url,
        })
    }

    async exists(item: UpcomingItem): Promise<boolean> {
        return !!await Release.findOne({
            where: {
                title: item.cover_card.title,
                effective_start_sell_date: item.effective_start_sell_date
            }
        })
    }
}

export default new ReleaseRepository()
