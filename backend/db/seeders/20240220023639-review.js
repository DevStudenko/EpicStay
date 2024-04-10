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
        review: "App Academy is a transformative enclave where the complexities of web development are unraveled. The staff’s expertise is evident, providing a robust support system that turns daunting coding challenges into stepping stones for success. It's an environment where learning and professional growth are not just goals, but realities. Each project and exercise is a deep dive into the real-world scenarios, ensuring that graduates are not just knowledgeable, but also adaptable and industry-ready. The camaraderie amongst peers and mentors alike makes for an unforgettable journey of professional metamorphosis.",
        stars: 5,
        spotId: 1,
        userId: 1
      },
      {
        review: "Embarking on the App Academy journey reshapes your understanding of what's possible in tech education. The curriculum is rigorous, yet the satisfaction of overcoming each hurdle is unparalleled. The true value lies not only in the skills gained but in the confidence to apply them in the real world. The program's emphasis on practical application through project-based learning ensures that students are not merely passive learners but active creators, ready to make their mark in the tech industry.",
        stars: 5,
        spotId: 1,
        userId: 2
      },
      {
        review: "CodeCamp is the epitome of a coding paradise, fostering a community where knowledge flourishes and everyone’s voice matters. The workshops are an incubator for innovation, transforming the eager learner into a seasoned developer ready to take on the tech world. It's a nurturing ground for those who not only want to learn how to code, but also want to think like a programmer. This is where you’re not taught just to solve problems, but to discover them, understand them, and then conquer them with code.",
        stars: 4,
        spotId: 2,
        userId: 2
      },
      {
        review: "The CodeCamp experience is distinguished by its emphasis on practical, hands-on learning. With a curriculum designed to challenge and enhance your skills, it’s the ideal place for anyone aiming to refine their coding prowess and stay ahead in the industry. The community around CodeCamp is a tight-knit group of forward thinkers who are ever-ready to share knowledge and experiences, which enriches the learning environment and fosters a culture of collective growth.",
        stars: 5,
        spotId: 2,
        userId: 3
      },
      {
        review: "DevStudio is where creativity meets capability within an innovative setting designed to inspire. The open-plan workspace is a hive of activity, a testament to the vibrant community of developers each contributing to the collective pool of knowledge. As you step into DevStudio, you're greeted with a rush of energy, a palpable sense of innovation that permeates through the place, igniting a drive to build and create. Here, each day presents a new opportunity to collaborate on projects that could define the next wave of tech advancements.",
        stars: 5,
        spotId: 3,
        userId: 3
      },
      {
        review: "The spirit of collaboration at DevStudio sets it apart, with a modern space that’s as much about fostering connections as it is about software development. Here, you’ll find not just resources, but also a network of support and inspiration. The workstations are arenas for productivity, and the breakout areas invite brainstorming sessions that are as fun as they are fruitful, ensuring that every idea gets the space to grow and flourish.",
        stars: 4,
        spotId: 3,
        userId: 1
      },
      {
        review: "DevDemo is not just a space but a crucible of innovation, where every conversation could lead to the next big idea. It’s a sanctuary for those who think differently and are not afraid to experiment in the quest for groundbreaking solutions. The workshops and tech talks are not just informative but transformative, sparking discussions that challenge conventional thinking and encourage out-of-the-box solutions.",
        stars: 4,
        spotId: 4,
        userId: 4
      },
      {
        review: "DevDemo exudes an atmosphere that’s ripe for ideation and collaboration, making it an ideal venue for those in pursuit of tech excellence. It’s more than a workspace; it’s a think tank where future tech leaders cut their teeth. Surrounded by like-minded individuals, the environment is conducive to learning, innovation, and the sharing of a vast array of diverse tech-centric perspectives.",
        stars: 5,
        spotId: 4,
        userId: 1
      },
      {
        review: "Spot 5 stands as an idyllic retreat from the hustle of life, a serene haven where nature’s beauty is a backdrop to a weekend of relaxation. The gentle rustle of leaves and the tranquil murmur of the nearby brook offer a peaceful symphony for any guest. As the day closes, the nights at Spot 5 are a stargazer's delight, with clear skies offering a tapestry of constellations to those who find solace in the cosmos.",
        stars: 5,
        spotId: 5,
        userId: 2
      },
      {
        review: "The service at Spot 5 is as warm as the setting sun that bathes its verdant landscape in golden hues. It’s a place where comfort aligns with nature’s rhythm, offering a home away from home that welcomes you with open arms. The local cuisine is a delightful exploration of flavors, with each dish crafted from the freshest local produce, adding yet another layer of enjoyment to the stay.",
        stars: 4,
        spotId: 5,
        userId: 3
      },
      {
        review: "Spot 6 is a tapestry of natural splendor and refined luxury, a perfect balance for those seeking a romantic escape. The views from every vantage point are postcard-worthy, ensuring that each moment spent here becomes a cherished memory. The accommodations are designed with an elegant touch, blending seamlessly with the surroundings to provide an intimate and luxurious experience.",
        stars: 5,
        spotId: 6,
        userId: 4
      },
      {
        review: "Luxury and attention to detail are the hallmarks of Spot 6, where every amenity is curated to offer unparalleled comfort. It’s a place that doesn’t just meet expectations but surpasses them, providing an exceptional stay from arrival to departure. The staff’s dedication to guest experience is evident in every interaction, ensuring that your stay is as perfect as the setting itself.",
        stars: 5,
        spotId: 6,
        userId: 1
      },
      {
        review: "Spot 7 is the ultimate destination for those who thrive in the outdoors. The proximity to nature’s untouched beauty offers a canvas for adventure and the lodge itself provides a cozy nest to rest after a day of exploration. With its rich variety of flora and fauna, every trail leads to new discoveries, inviting guests to connect with the environment in a profound way.",
        stars: 4,
        spotId: 7,
        userId: 2
      },
      {
        review: "The solace found at Spot 7 is a rare treasure, a peaceful enclave that soothes the soul and rejuvenates the spirit. Its commitment to providing a serene experience is evident in every element, from the eco-friendly design to the mindful integration with the natural world. The evenings here are a time for reflection, for campfires and conversations under the stars that remind us of the simple joys of life.",
        stars: 5,
        spotId: 7,
        userId: 3
      }
      
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {});
  }
};
