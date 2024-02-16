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
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 1,
          max: 5
        }
      },
      spotId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};