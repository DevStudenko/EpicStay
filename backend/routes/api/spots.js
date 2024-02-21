const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');



router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ]
    });

    let modifiedSpots = []; // Array to store modified spot objects

    spots.forEach(spot => {
        let spotObj = spot.toJSON();
        let count = spotObj.Reviews.length;
        let total = 0; // Reset total for each spot

        for (let review of spotObj.Reviews) {
            total += review.stars;
        }

        spotObj.avgRating = count > 0 ? total / count : 0; // Handle case where count is 0
        spotObj.previewImage = spotObj.SpotImages[0] ? spotObj.SpotImages[0].url : null; // Handle case where there are no images
        delete spotObj.Reviews;
        delete spotObj.SpotImages;

        modifiedSpots.push(spotObj); // Add modified spot object to the array
    });

    return res.json(modifiedSpots); // Return the array of modified spot objects
});


router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.dataValues.id;
    const spots = await Spot.findAll({
        where: {
            ownerId: parseInt(currentUserId)
        },
        include: [
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ]
    });

    let modifiedSpots = []; // Array to store modified spot objects

    spots.forEach(spot => {
        let spotObj = spot.toJSON();
        let count = spotObj.Reviews.length;
        let total = 0; // Reset total for each spot

        for (let review of spotObj.Reviews) {
            total += review.stars;
        }

        spotObj.avgRating = count > 0 ? total / count : 0; // Handle case where count is 0
        spotObj.previewImage = spotObj.SpotImages[0] ? spotObj.SpotImages[0].url : null; // Handle case where there are no images
        delete spotObj.Reviews;
        delete spotObj.SpotImages;

        modifiedSpots.push(spotObj); // Add modified spot object to the array
    });
    return res.json(modifiedSpots);
})


module.exports = router;