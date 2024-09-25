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
        }
    ]
}
