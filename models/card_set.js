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
      models.CardSet.belongsToMany(models.BlackCard, {
        through: 'card_set_black_card',
        as: 'blackCards',
        foreignKey: 'card_set_id'
      });
      models.CardSet.belongsToMany(models.WhiteCard, {
        through: 'card_set_white_card',
        as: 'whiteCards',
        foreignKey: 'card_set_id'
      });
    }
  });
};
