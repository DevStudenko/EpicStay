'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        isInt: true,
        notNull: true,
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [5, 80]
      }
    },
    state: {
      type: DataTypes.TEXT,
      validate: {
        isAlpha: true,
        len: [2, 30],
        notEmpty: true,
        notNull: true
      }
    },
    city: {
      type: DataTypes.TEXT,
      validate: {
        isAlpha: true,
        len: [5, 30],
        notEmpty: true,
        notNull: true
      }
    },
    country: {
      type: DataTypes.TEXT,
      validate: {
        isAlpha: true,
        len: [3, 30],
        notNull: true,
        notEmpty: true
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    name: {
      type: DataTypes.TEXT,
      validate: {
        isAlpha: true,
        len: [3, 50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        notNull: true,
        notEmpty: true,
        isNumeric: true,
        isDecimal: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};