import Sequelize from 'sequelize';
import R from 'ramda';
import {arrayify, restrictId} from './shared_validators';

export default function(sequelize, DataTypes) {
  return sequelize.define('BlackCard', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        /**
         * Some databases do not allow inserting a value for autoincrement fields
         * such as Oracle.
         */
        isNull: true
      }
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true
      }
    },
    draw: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        isNumeric: true
      }
    },
    pick: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 0,
        isNumeric: true
      }
    },
    watermark: {
      type: DataTypes.STRING(5),
      validate: {
        len: [0, 5]
      }
    }
  }, {
    tableName: 'black_cards',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    associate: (models) => {
      models.BlackCard.belongsToMany(models.CardSet, {
        through: 'card_set_black_card',
        as: 'cardSets',
        foreignKey: 'black_card_id'
      });
    }
  });
};
