'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            UPDATE chats 
            SET market_id = 1 
            WHERE market_id IS NULL
        `)
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`
            UPDATE chats 
            SET market_id = NULL 
            WHERE market_id = 1
        `)
    }
}

