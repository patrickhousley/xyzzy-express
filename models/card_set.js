import Sequelize from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('CardSet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255)
    },
    base_deck: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255)
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    tableName: 'card_set',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    associate: (models) => {
      models.BlackCard.belongsToMany(models.CardSet, {
        through: models.CardSetBlackCard,
        as: { singular: 'card_set_id', plural: 'card_set_id' }
      });
      models.WhiteCard.belongsToMany(models.CardSet, {
        through: models.CardSetWhiteCard,
        as: { singular: 'card_set_id', plural: 'card_set_id' }
      });
    }
  });
};
