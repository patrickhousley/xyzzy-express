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
    classMethods: {
      associate: (models) => {
        models.CardSet.belongsToMany(models.BlackCard, {
          through: models.CardSetBlackCard,
          as: { singular: 'blackCard', plural: 'blackCards' },
          foreignKey: {
            name: 'card_set_id',
            allowNull: false,
            validate: {
              notEmpty: true
            }
          }
        });
        models.CardSet.belongsToMany(models.WhiteCard, {
          through: models.CardSetWhiteCard,
          as: { singular: 'whiteCard', plural: 'whiteCards' },
          foreignKey: {
            name: 'card_set_id',
            allowNull: false,
            validate: {
              notEmpty: true
            }
          }
        });
      }
    }
  });
};
