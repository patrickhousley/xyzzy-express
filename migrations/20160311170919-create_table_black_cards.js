'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('black_cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      draw: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      pick: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      watermark: {
        type: Sequelize.STRING(5)
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('black_cards');
  }
};
