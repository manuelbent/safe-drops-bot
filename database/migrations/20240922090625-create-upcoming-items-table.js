'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('upcoming_items', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            subtitle: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            effective_start_sell_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            img_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            deeplink: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('upcoming_items')
    }
}
