'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('card_set_white_card', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      card_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      white_card_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('card_set_white_card');
  }
};
