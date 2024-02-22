'use strict';

const { Review } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        "review": "App Academy was an amazing experience. The instructors are top-notch, and I learned so much about web development.",
        "stars": 5,
        "spotId": 1,
        "userId": 1
      },
      {
        "review": "CodeCamp is a great place for coding enthusiasts. The community is supportive, and the workshops are very informative.",
        "stars": 4,
        "spotId": 2,
        "userId": 2
      },
      {
        "review": "DevStudio is a fantastic space for software development. The innovative environment really fosters creativity and learning.",
        "stars": 5,
        "spotId": 3,
        "userId": 3
      },
      {
        "review": "I had a great time learning at App Academy. The curriculum is challenging but rewarding, and the staff is always helpful.",
        "stars": 5,
        "spotId": 1,
        "userId": 2
      },
      {
        "review": "CodeCamp offers a great learning experience with a focus on practical skills. Highly recommend for anyone looking to improve their coding abilities.",
        "stars": 5,
        "spotId": 2,
        "userId": 3
      },
      {
        "review": "DevStudio has a great atmosphere for developers. The workspace is modern and equipped with everything you need for software development.",
        "stars": 4,
        "spotId": 3,
        "userId": 1
      },
      {
        "review": "App Academy was an amazing experience. The instructors are top-notch, and I learned so much about web development.",
        "stars": 5,
        "spotId": 4,
        "userId": 4
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {});
  }
};
