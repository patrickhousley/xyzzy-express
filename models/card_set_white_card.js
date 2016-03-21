import Sequelize from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('CardSetWhiteCard', {
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
    tableName: 'card_set_white_card',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });
};
