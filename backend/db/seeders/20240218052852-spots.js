'use strict';

const { Spot } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        "ownerId": 1,
        "address": "123 Disney Lane",
        "city": "San Francisco",
        "state": "California",
        "country": "United States of America",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "App Academy",
        "description": "Place where web developers are created",
        "price": 123
      },
      {
        "ownerId": 2,
        "address": "456 Pixar Street",
        "city": "Los Angeles",
        "state": "California",
        "country": "United States of America",
        "lat": 34.052235,
        "lng": -118.243683,
        "name": "CodeCamp",
        "description": "A hub for coding enthusiasts",
        "price": 200
      },
      {
        "ownerId": 3,
        "address": "789 Marvel Avenue",
        "city": "New York",
        "state": "New York",
        "country": "United States of America",
        "lat": 40.712776,
        "lng": -74.005974,
        "name": "DevStudio",
        "description": "Innovative space for software development",
        "price": 150
      },
      {
        "ownerId": 4,
        "address": "789 demo-demo",
        "city": "demooo",
        "state": "demmmmo",
        "country": "demo",
        "lat": 40.712776,
        "lng": -74.005974,
        "name": "DevDemo",
        "description": "demmmoooo",
        "price": 999
      },
      {
        ownerId: 5,
        address: "101 Example Street",
        city: "Example City",
        state: "Example State",
        country: "Example Country",
        lat: 123.456,
        lng: 78.910,
        name: "Spot Five",
        description: "A lovely spot for a getaway",
        price: 150
      },
      {
        ownerId: 6,
        address: "202 Sample Road",
        city: "Sample City",
        state: "Sample State",
        country: "Sample Country",
        lat: 234.567,
        lng: 89.101,
        name: "Spot Six",
        description: "A perfect spot for relaxation",
        price: 200
      },
      {
        ownerId: 7,
        address: "303 Test Lane",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
        lat: 345.678,
        lng: 90.111,
        name: "Spot Seven",
        description: "An ideal spot for adventure seekers",
        price: 250
      }

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
