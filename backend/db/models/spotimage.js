'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });
    }
  }
  SpotImage.init({
    preview: DataTypes.BOOLEAN,
    spotId: DataTypes.INTEGER,
    url: DataTypes.TEXT,
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
    modelName: 'SpotImage',
  });
  return SpotImage;
};