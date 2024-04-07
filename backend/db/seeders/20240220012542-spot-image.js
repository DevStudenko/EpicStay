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
        "url": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
      },
      {
        "preview": true,
        "spotId": 3,
        "url": "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg"
      },
      {
        "preview": true,
        "spotId": 2,
        "url": "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg"
      },
      {
        "preview": true,
        "spotId": 4,
        "url": "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg"
      }

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    // First, delete records from the SpotImage table
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 3] }
    });


    // options.tableName = 'Spots';
    // return queryInterface.bulkDelete(options, null, {});
  }
};