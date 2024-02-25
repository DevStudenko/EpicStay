'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue('startDate');
        return rawValue ? rawValue.toISOString().substring(0, 10) : null;
      }
    },
    endDate: {
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue('endDate');
        return rawValue ? rawValue.toISOString().substring(0, 10) : null;
      }
    },
    spotId: DataTypes.INTEGER,
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
    modelName: 'Booking',
  });
  return Booking;
};