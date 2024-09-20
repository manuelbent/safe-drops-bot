interface FeedResponse {
    items: object[]
    pagination: {
        next: {
            href: string|null
        }
    }
}
