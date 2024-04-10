'use strict';

const { ReviewImage } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=1&variation=1"
      },
      {
        reviewId: 4,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=1&variation=2"
      },
      // Review images for reviews of Spot 2
      {
        reviewId: 2,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=2&variation=1"
      },
      {
        reviewId: 5,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=2&variation=2"
      },
      // Review images for reviews of Spot 3
      {
        reviewId: 3,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=3&variation=1"
      },
      {
        reviewId: 6,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=3&variation=2"
      },
      // Review image for review of Spot 4
      {
        reviewId: 7,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=4&variation=1"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {});
  }
};
