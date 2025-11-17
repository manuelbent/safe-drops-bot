'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ovpn_configs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            config_path: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            connected_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            }
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('ovpn_configs')
    }
}
