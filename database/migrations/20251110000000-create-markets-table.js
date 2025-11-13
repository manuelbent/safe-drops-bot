'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('markets', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING(2),
                allowNull: false,
                unique: true,
            },
            label: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            emoji: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            adjective: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            api_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            }
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('markets')
    }
}
