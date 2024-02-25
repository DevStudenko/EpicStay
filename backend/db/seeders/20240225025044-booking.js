'use strict';

const { Booking } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-02-25',
        endDate: '2024-02-28'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-03-01',
        endDate: '2024-03-05'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2024-03-10',
        endDate: '2024-03-12'
      },
      {
        spotId: 4,
        userId: 4,
        startDate: '2024-03-15',
        endDate: '2024-03-18'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-03-20',
        endDate: '2024-03-22'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-03-25',
        endDate: '2024-03-27'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options, {});
  }
};
