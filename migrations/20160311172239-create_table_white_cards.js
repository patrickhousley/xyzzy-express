'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('white_cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      watermark: {
        type: Sequelize.STRING(5)
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('white_cards');
  }
};
