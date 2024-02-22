'use strict';

const { SpotImage } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        "preview": true,
        "spotId": 1,
        "url": "https://example.com/image1.jpg"
      },
      {
        "preview": false,
        "spotId": 2,
        "url": "https://example.com/image2.jpg"
      },
      {
        "preview": true,
        "spotId": 3,
        "url": "https://example.com/image3.jpg"
      },
      {
        "preview": true,
        "spotId": 4,
        "url": "https://example.com/image4.jpg"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    // First, delete records from the SpotImage table
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, null, {});

    // Then, delete records from the Spots table
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, null, {});
  }
};