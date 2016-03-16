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
    watermark: {
      type: DataTypes.STRING(5)
    }
  }, {
    tableName: 'black_cards',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    associate: (models) => {
      models.BlackCard.belongsToMany(models.CardSet, {
        through: models.CardSetBlackCard,
        as: { singular: 'black_card_id', plural: 'black_card_id' }
      });
    }
  });
};
