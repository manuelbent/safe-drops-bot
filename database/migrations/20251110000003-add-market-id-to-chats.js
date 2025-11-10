'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('chats', 'market_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'markets',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        })
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('chats', 'market_id')
    }
}

