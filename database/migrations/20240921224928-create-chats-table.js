'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('chats', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            subscribed_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            }
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('chats')
    }
}
