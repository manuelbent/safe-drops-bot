'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('upcoming_items', 'hash_key', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '-',
        })
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('upcoming_items', 'hash_key')
    }
}
