const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
//express-validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                attributes: ["url"]
            },

            {
                model: Review,
                attributes: ["stars"]
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

        spotObj.avgStarRating = count > 0 ? total / count : 0; // Handle case where count is 0
        spotObj.previewImage = spotObj.SpotImages[0] ? spotObj.SpotImages[0].url : null; // Handle case where there are no images
        delete spotObj.Reviews;
        delete spotObj.SpotImages;

        modifiedSpots.push(spotObj); // Add modified spot object to the array
    });

    return res.json(modifiedSpots); // Return the array of modified spot objects
});

//get all current users spots
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
    let spotObj, count, total
    spots.forEach(spot => {
        spotObj = spot.toJSON();
        count = spotObj.Reviews.length;
        total = 0; // Reset total for each spot

        for (let review of spotObj.Reviews) {
            total += review.stars;
        }

        spotObj.avgStarRating = count > 0 ? total / count : 0; // Handle case where count is 0
        spotObj.previewImage = spotObj.SpotImages[0] ? spotObj.SpotImages[0].url : null; // Handle case where there are no images
        delete spotObj.Reviews;
        delete spotObj.SpotImages;

        modifiedSpots.push(spotObj); // Add modified spot object to the array
    });
    return res.json(modifiedSpots);
});

//get spot by spotId
router.get('/:spotId', async (req, res, next) => {
    let spotObj;
    try {
        const { spotId } = req.params;
        const spot = await Spot.findOne({
            where: {
                id: spotId
            },
            include: [
                {
                    model: Review,
                    attributes: ["stars"]
                },
                {
                    model: SpotImage,
                    attributes: ["id", "url", "preview"]
                },
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"]
                }
            ]
        });


        spotObj = spot.toJSON();
        let count = spotObj.Reviews.length;
        spotObj.numReviews = count;
        let total = 0;
        spotObj.Reviews.forEach(review => {
            total += review.stars
        });
        console.log(total)
        spotObj.avgStarRating = count > 0 ? total / count : 0; // Handle case where count is 0

        spotObj.avgStarRating = count > 0 ? total / count : 0; // Handle case where count is 0
        spotObj.Owner = spotObj.User;

        delete spotObj.User
        delete spotObj.Reviews;
    } catch (err) {
        next(err);
        res.status(404);
        return res.json(
            {
                "message": "Spot couldn't be found"
            }
        );
    }

    return res.json(spotObj);
});



const validateCreateSpot = [
    check("address")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check("city")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check("state")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check("lat")
        .notEmpty()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    check("lng")
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    check("name")
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .notEmpty()
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("price")
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage('Price must be greater than 0'),
    handleValidationErrors,
];

//create a new spot 
router.post('/', requireAuth, validateCreateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.dataValues.id;
    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
    return res.status(201).json(newSpot);
})


module.exports = router;