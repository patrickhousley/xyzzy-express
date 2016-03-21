import Sequelize from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('CardSetBlackCard', {
    card_set_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    black_card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'card_set_black_card',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });
};
