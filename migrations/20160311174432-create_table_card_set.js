'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('card_set', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
      name: {
        type: Sequelize.STRING
      },
      base_deck: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.INTEGER,
        defaultValue: false,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('card_set');
  }
};
