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

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      });
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    state: DataTypes.TEXT,
    city: DataTypes.TEXT,
    country: DataTypes.TEXT,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue('createdAt');
        return rawValue ? rawValue.toISOString().replace('T', ' ').substring(0, 19) : null;
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue('updatedAt');
        return rawValue ? rawValue.toISOString().replace('T', ' ').substring(0, 19) : null;
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};