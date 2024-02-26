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
        userId: 3,
        startDate: '2024-02-25',
        endDate: '2024-02-28'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-03-01',
        endDate: '2024-03-05'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2024-03-01',
        endDate: '2024-03-05'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 3, 2] }
    });
  }
};
