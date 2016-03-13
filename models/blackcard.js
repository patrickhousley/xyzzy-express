import Sequelize from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('BlackCard', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    draw: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pick: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    text: {
      type: DataTypes.STRING(5)
    }
  }, {
    tableName: 'black_cards',
    associate: (models) => {

    }
  });
};
