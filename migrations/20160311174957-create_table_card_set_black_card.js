'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('card_set_black_card', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      card_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      black_card_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('card_set_black_card');
  }
};
