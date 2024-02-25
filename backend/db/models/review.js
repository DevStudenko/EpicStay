'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId'
      });
    }
  }
  Review.init({
    review: DataTypes.TEXT,
    stars: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
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
    modelName: 'Review',
  });
  return Review;
};