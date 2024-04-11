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
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Nestled in the bustling heart of San Francisco, App Academy is a beacon for burgeoning web developers. This hallowed hall of code is where raw talent is sculpted into technical prowess. Students immerse themselves in a rigorous curriculum, tempered by the innovative spirit of the Bay Area. The camaraderie forged within these walls is as enduring as the skills learned, creating a network that spans the globe. Beyond coding, it's a crucible where problem-solving and critical thinking are honed to precision. Graduates emerge not just with knowledge, but with a transformative new way of thinking.",
        price: 123
      },
      {
        ownerId: 2,
        address: "456 Pixar Street",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.052235,
        lng: -118.243683,
        name: "CodeCamp",
        description: "CodeCamp, situated in the vibrant heart of Los Angeles, is a sanctuary for coding enthusiasts. The energy of the city seeps into the learning environment, invigorating every session with a sense of possibility. Here, emerging programmers find their voice, and experienced coders find new challenges. The curriculum is a finely tuned symphony of modern theory and practical application, echoing the dynamic rhythm of L.A. itself. For those who seek to master the digital world, CodeCamp is a stairway to tech heaven, with every line of code paving the path to future success.",
        price: 200
      },
      {
        ownerId: 3,
        address: "789 Marvel Avenue",
        city: "New York",
        state: "New York",
        country: "United States of America",
        lat: 40.712776,
        lng: -74.005974,
        name: "DevStudio",
        description: "DevStudio stands as a monument to innovation in the concrete jungle of New York. This cutting-edge space for software development is where imagination meets implementation. Bathed in the city's relentless energy, DevStudio's environment is electric, driving forward the dreams of developers. The studio offers a panorama of New York's skyline, inspiring designs as bold as the city itself. Here, every tool and resource is at your fingertips, encouraging a leap into technological advancements. DevStudio is more than a place; it's the pulsating heart of the city's tech revolution.",
        price: 150
      },
      {
        ownerId: 4,
        address: "789 demo-demo",
        city: "demooo",
        state: "demmmmo",
        country: "demo",
        lat: 40.712776,
        lng: -74.005974,
        name: "DevDemo",
        description: "At DevDemo, the ethos is all about exploration and pushing the boundaries of technology. Situated in a realm where imagination runs wild, this spot is a testament to the art of the possible. In this crucible of innovation, each idea is given the space to breathe and the support to flourish. Here, the norm is challenged, the status quo upended, and the future is written in code. Surrounded by the limitless potential of creativity, DevDemo is the dreamer's workshop, the tinkerer's playground, and the innovator's haven all rolled into one.",
        price: 999
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
        description: "Spot Five is an embodiment of tranquility and charm. This picturesque getaway is nestled in the serene embrace of Example Country, offering a retreat from the clamor of everyday life. The beauty of nature is in full display, with verdant fields stretching to the horizon, framed by the breathtaking Example Mountain range. This spot is a sanctuary for the soul, a place where each sunrise rejuvenates and every sunset inspires. Within this haven, every moment is a treasure and every breath a new memory.",
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
        description: "Spot Six offers a masterclass in elegance and repose. Perched gracefully in the lush landscape of Sample State, this exquisite destination merges the splendor of nature with the pinnacle of luxury. The architecture is a harmonious blend of traditional charm and contemporary sophistication, providing an ambiance of refined tranquility. Guests are treated to panoramic vistas that stretch to the horizon, where the sky meets the verdant earth. It's a sanctuary where time slows, and the finer things in life are savored in peaceful solitude.",
        price: 250
      },
      {
        ownerId: 7,
        address: "303 Inspiration Boulevard",
        city: "Innovate City",
        state: "Creative State",
        country: "Imaginative Country",
        lat: 345.678,
        lng: 90.111,
        name: "Spot Seven",
        description: "Spot Seven is a haven for the creative spirit, nestled in the heart of Imaginative Country. It stands as a beacon of inspiration, surrounded by a landscape that fuels the imagination. Here, innovation is the air you breathe, and every corner is a canvas for new ideas. The accommodations are designed with the artist in mind, blending comfort with an aesthetic that sparks creativity. Whether it's the vibrant murals that adorn the walls or the thoughtful design that encourages reflection, Spot Seven is where dreams are nurtured and visions come to life.",
        price: 180
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
