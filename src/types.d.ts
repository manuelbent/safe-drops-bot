interface NikeUpcomingItem {
    effective_start_sell_date: Date
    cover_card: {
        square_image: {
            url: string
        }
        subtitle: string
        title: string
    }
    products: [
        {
            style_color: string
            product_type: string
            assets: [
                {
                    view: string
                    url: string
                }
            ]
        },
    ]
}

interface NikeFeedItem {
    type: 'product-card' | 'pass-card'
    title: string
    cover_card: {
        square_image: {
            url: string
        }
    }
    products?: [
        {
            style_color: string
            product_type: string
        }
    ]
    reserve_start?: Date
    reserve_end?: Date
}
