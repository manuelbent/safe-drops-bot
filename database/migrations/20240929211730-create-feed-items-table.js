'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('feed_items', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            img_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            effective_start_sell_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            style_color: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            reserve_start: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            reserve_end: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('feed_items')
    }
}
