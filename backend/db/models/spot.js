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
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER
    },
    address: {
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.TEXT
    },
    city: {
      type: DataTypes.TEXT
    },
    country: {
      type: DataTypes.TEXT
    },
    lat: {
      type: DataTypes.DECIMAL
    },
    lng: {
      type: DataTypes.DECIMAL
    },
    name: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};