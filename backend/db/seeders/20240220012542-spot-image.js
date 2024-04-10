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
        spotId: 1,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?variation=3",
        preview: false
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?variation=4",
        preview: false
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?variation=5",
        preview: false
      },
      // Spot 2
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?variation=2",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?variation=3",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?variation=4",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?variation=5",
        preview: false
      },
      // Spot 3
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?variation=2",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?variation=3",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?variation=4",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?variation=5",
        preview: false
      },
      // Spot 4
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?variation=2",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?variation=3",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?variation=4",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?variation=5",
        preview: false
      },
      // Spot 5
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=5&variation=1",
        preview: true
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=5&variation=2",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=5&variation=3",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=5&variation=4",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=5&variation=5",
        preview: false
      },
      // Spot 6
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=6&variation=1",
        preview: true
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=6&variation=2",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=6&variation=3",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=6&variation=4",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=6&variation=5",
        preview: false
      },
      // Spot 7
      {
        spotId: 7,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=7&variation=1",
        preview: true
      },
      {
        spotId: 7,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=7&variation=2",
        preview: false
      },
      {
        spotId: 7,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=7&variation=3",
        preview: false
      },
      {
        spotId: 7,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=7&variation=4",
        preview: false
      },
      {
        spotId: 7,
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?spot=7&variation=5",
        preview: false
      }

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    // First, delete records from the SpotImage table
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    });


    // options.tableName = 'Spots';
    // return queryInterface.bulkDelete(options, null, {});
  }
};