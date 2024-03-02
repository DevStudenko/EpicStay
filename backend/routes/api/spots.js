const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
//express-validator
const { check, query } = require('express-validator');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');

const handleValidateQuery = [
    query("page")
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1")
        .optional(),
    query("page")
        .isInt({ max: 10 })
        .withMessage("Page must be less than or equal to 10")
        .optional(),
    query("size")
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1")
        .optional(),
    query("size")
        .isInt({ max: 20 })
        .withMessage("Size must be less than or equal to 20")
        .optional(),
    query("minLat")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Minimum latitude must be -90 or greater")
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxLat;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error(
                    "Minimum latitude cannot be greater than maximum latitude"
                );
            }
        })
        .optional(),
    query("maxLat")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Maximum latitude must be equal to or less than 90")
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minLat;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error(
                    "Maximum latitude cannot be less than minimum latitude"
                );
            }
        })
        .optional(),
    query("minLng")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Minimum longitude must be -180 or greater")
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxLng;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error(
                    "Minimum longitude cannot be greater than maximum longitude"
                );
            }
        })
        .optional(),
    query("maxLng")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Maximum longitude must be 180 or less")
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minLng;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error(
                    "Maximum longitude cannot be less than minimum longitude"
                );
            }
        })
        .optional(),
    query("minPrice")
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0")
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxPrice;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error("Minimum price cannot be greater than maximum price");
            }
        })
        .optional(),
    query("maxPrice")
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0")
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minPrice;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error("Maximum price cannot be less than minimum price");
            }
        })
        .optional(),
    handleValidationErrors,
];

// Get all Spots
router.get("/", handleValidateQuery, async (req, res) => {
    let { page, size, maxLat, minLat, minLng, maxLng } = req.query;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    let limit = size;
    let offset = size * (page - 1);

    const options = {
        include: [
            { model: Review },
            { model: SpotImage, where: { preview: true }, required: false },
        ],
        where: {},
        limit,
        offset,
    };

    if (minLat) {
        options.where.lat = { [Op.gte]: minLat };
    }
    if (maxLat) {
        options.where.lat = { [Op.lte]: maxLat };
    }
    if (minLng) {
        options.where.lng = { [Op.gte]: minLng };
    }
    if (maxLng) {
        options.where.lng = { [Op.lte]: maxLng };
    }
    if (minPrice) {
        options.where.price = { [Op.gte]: minPrice };
    }
    if (maxPrice) {
        options.where.price = { [Op.lte]: maxPrice };
    }
    let allSpots = await Spot.findAll(options);

    allSpots = allSpots.map((spot) => {
        const reviews = spot.Reviews;
        const numReviews = reviews.length;
        let sum = 0;
        reviews.forEach((review) => {
            sum += review.stars;
        });
        const avgRating = sum / numReviews;
        spot.dataValues.avgRating = avgRating;
        delete spot.dataValues.Reviews;

        spot.dataValues.previewImage = "";
        if (spot.dataValues.SpotImages) {
            const foundSpotImage = spot.dataValues.SpotImages.find((image) => {
                return image.preview;
            });
            if (foundSpotImage) {
                spot.dataValues.previewImage = foundSpotImage.url;
            }
        }


        delete spot.dataValues.SpotImages;
        return spot;
    });
    const resObj = { Spots: allSpots, page, size };
    return res.status(200).json(resObj);
});

//Get all Spots owned by the Current User

router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id;
    const spots = await Spot.findAll({
        where: {
            ownerId: currentUserId
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

        // Add modified spot object to the array
        modifiedSpots.push(spotObj);
    });
    const response = { Spots: modifiedSpots }
    return res.json(response);
});

//get spot by spotId
router.get('/:spotId', async (req, res, next) => {
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

        if (!spot) { // Check if the spot is null
            return res.status(404).json({
                "message": "Spot couldn't be found"
            });
        }

        let spotObj = spot.toJSON();
        let count = spotObj.Reviews.length;
        spotObj.numReviews = count > 0 ? count : null; // Set to null if there are no reviews
        let total = 0;
        spotObj.Reviews.forEach(review => {
            total += review.stars
        });
        spotObj.avgStarRating = count > 0 ? total / count : null; // Set to null if there are no reviews

        spotObj.Owner = spotObj.User;
        delete spotObj.User;
        delete spotObj.Reviews;

        return res.json(spotObj);
    } catch (err) {
        next(err);
    }
});



//Get all Reviews by a Spot's id

router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
        where: {
            spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    return res.status(200).json({ Reviews: reviews });
});


const validateSpotBody = [
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
        .withMessage('Latitude must be within -90 and 90'),
    check("lng")
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
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
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors,
];

//Create a spot
router.post('/', requireAuth, validateSpotBody, async (req, res, next) => {
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

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.dataValues.id;
    const spot = await Spot.findByPk(spotId);
    let spotImage;
    if (spot) {
        if (spot.ownerId === userId) {
            spotImage = await SpotImage.create({
                spotId,
                url,
                preview
            });

            const response = {
                id: spotImage.id,
                url: spotImage.url,
                preview: spotImage.preview
            }

            return res.json(response);
        } else {
            return res.status(403).json({
                "message": "Forbidden"
            });
        }
    } else {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }
});

//create a Review
const validateReviewBody = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];


router.post('/:spotId/reviews', requireAuth, validateReviewBody, async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.dataValues.id;

    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }

    // Check if the user already has a review for this spot
    const existingReview = await Review.findOne({
        where: {
            userId,
            spotId
        }
    });

    if (existingReview) {
        return res.status(403).json({
            "message": "User already has a review for this spot"
        });
    }

    // Create the new review
    const newReview = await Review.create({
        review,
        stars,
        spotId,
        userId
    });

    // Construct the response object
    const response = {
        id: newReview.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
    };

    return res.status(201).json(response);
});


//Edit a Spot
router.put('/:spotId', requireAuth, validateSpotBody, async (req, res, next) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.dataValues.id;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        if (spot.ownerId === userId) {
            spot.address = address
            spot.city = city
            spot.state = state
            spot.country = country
            spot.lat = lat
            spot.lng = lng
            spot.name = name
            spot.description = description
            spot.price = price
            await spot.save()
        } else {
            return res.status(403).json({
                "message": "Forbidden"
            });
        }
    } else {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }
    return res.json(spot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.dataValues.id;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
        if (spot.ownerId === userId) {
            await spot.destroy();
            return res.json({
                "message": "Successfully deleted"
            });
        } else {
            return res.status(403).json({
                "message": "Forbidden"
            });
        }
    } else {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const bookings = await Booking.findAll({
        where: {
            spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['ownerId']
            }
        ]
    });

    if (bookings.length === 0) return res.status(404).json({
        message: "Spot couldn't be found"
    });

    const isOwner = bookings[0].Spot.ownerId === req.user.id;

    if (isOwner) {
        const ownersSpotBookings = bookings.map(booking => ({
            User: {
                id: booking.User.id,
                firstName: booking.User.firstName,
                lastName: booking.User.lastName,
            },
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }))
        return res.json({ Bookings: ownersSpotBookings });
    } else {
        const publicSpots = bookings.map(booking => ({
            spotId: booking.spotId,
            startDate: booking.startDate,
            endDate: booking.endDate
        }));
        return res.json({ Bookings: publicSpots });
    }
});


// Create a Booking from a Spot based on the Spot's id
// Validation middleware for booking
const validateCreateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('startDate is required')
        .isISO8601()
        .withMessage('startDate must be a valid date')
        .custom((value, { req }) => {
            if (new Date(value) < new Date()) {
                throw new Error('startDate cannot be in the past');
            }
            return true;
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('endDate is required')
        .isISO8601()
        .withMessage('endDate must be a valid date')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('endDate cannot be on or before start date');
            }
            return true;
        }),
    handleValidationErrors
];
router.post("/:spotId/bookings", requireAuth, validateBooking, async (req, res, next) => {
    const currentUserId = req.user.id;
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;

    // Retrieve location information along with associated reservations
    const location = await Spot.findByPk(spotId, {
        include: [Booking],
    });

    if (!location) {
        return res.status(404).json({
            message: "Spot couldn't be found",
        });
    }

    // Check if the location belongs to the current user
    if (currentUserId === location.ownerId) {
        return res.status(403).json({
            message: "Forbidden",
        });
    }

    const existingReservations = location.dataValues.Bookings || [];
    let conflictFound = false;
    let surroundingConflict = false;
    const conflictMessages = {};

    for (let reservation of existingReservations) {
        const bookedStart = new Date(reservation.startDate).getTime();
        const bookedEnd = new Date(reservation.endDate).getTime();
        const newStart = new Date(startDate).getTime();
        const newEnd = new Date(endDate).getTime();

        // Check for overlap between the existing reservation and the new reservation
        if ((newStart <= bookedEnd && newEnd >= bookedStart) || (bookedStart <= newEnd && bookedEnd > newStart)) {
            conflictFound = true;
            if ((newStart >= bookedStart && newStart <= bookedEnd) || newStart == bookedStart) {
                conflictMessages.startDate = "Start date conflicts with an existing booking";
            }
            if ((newEnd >= bookedStart && newEnd <= bookedEnd) || newEnd == bookedEnd) {
                conflictMessages.endDate = "End date conflicts with an existing booking";
            }
            // Check if the new reservation completely surrounds an existing reservation
            if (newStart < bookedStart && newEnd > bookedEnd) {
                surroundingConflict = true;
            }
        }
    }

    if (conflictFound) {
        if (surroundingConflict) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    error: "Dates overlap an existing booking"
                }
            });
        } else {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: conflictMessages,
            });
        }
    }

    // Create new reservation
    const booking = await Booking.create({
        spotId,
        userId: currentUserId,
        startDate,
        endDate
    });


    return res.status(200).json(booking);
});




module.exports = router;


