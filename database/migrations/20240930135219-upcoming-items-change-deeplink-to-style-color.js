'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.renameColumn('upcoming_items', 'deeplink', 'style_color')
    },

    async down(queryInterface) {
        await queryInterface.renameColumn('upcoming_items', 'style_color', 'deeplink')
    }
}
