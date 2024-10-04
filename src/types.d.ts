interface NikeUpcomingItem {
    analytics: {
        hash_key: string
    }
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
    analytics: {
        hash_key: string
    }
    type: string
    title: string
    cover_card: {
        square_image: {
            url: string
        }
    }
    valid_date?: Date
    effective_start_sell_date?: Date
    reserve_start?: Date
    reserve_end?: Date
}

interface OCRSpaceResponse {
    ParsedResults: [
        {
            ParsedText: string
        }
    ]
}
