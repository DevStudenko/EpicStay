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
        userId: 2,
        startDate: '2024-05-01',
        endDate: '2024-05-05'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-06-10',
        endDate: '2024-06-15'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-07-20',
        endDate: '2024-07-25'
      },
      {
        spotId: 4,
        userId: 2,
        startDate: '2024-08-05',
        endDate: '2024-08-10'
      },
      {
        spotId: 5,
        userId: 3,
        startDate: '2024-09-15',
        endDate: '2024-09-20'
      },
      {
        spotId: 6,
        userId: 1,
        startDate: '2024-10-10',
        endDate: '2024-10-15'
      },
      {
        spotId: 7,
        userId: 2,
        startDate: '2024-11-25',
        endDate: '2024-11-30'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    });
  }
};
