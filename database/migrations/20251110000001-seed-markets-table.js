'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('markets', [
            {
                code: 'EU',
                label: 'Europe',
                emoji: '🇪🇺',
                api_url: 'https://snkrs.services.nike.com/snkrs/content/v2/public/app/IT/it/upcoming',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                code: 'US',
                label: 'United States',
                emoji: '🇺🇸',
                api_url: 'https://snkrs.services.nike.com/snkrs/content/v2/public/app/US/en/upcoming',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                code: 'UK',
                label: 'United Kingdom',
                emoji: '🇬🇧',
                api_url: 'https://snkrs.services.nike.com/snkrs/content/v2/public/app/GB/en-GB/upcoming',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                code: 'JP',
                label: 'Japan',
                emoji: '🇯🇵',
                api_url: 'https://snkrs.services.nike.com/snkrs/content/v2/public/app/JP/ja/upcoming',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('markets', null, {})
    }
}
