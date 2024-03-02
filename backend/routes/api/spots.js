const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
//express-validator
const { check } = require('express-validator');
const { Op } = require('sequelize');
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

        modifiedSpots.push(spotObj); // Add modified spot object to the array
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
        createdAt: newReview.createdAt.toISOString().replace('T', ' ').substring(0, 19),
        updatedAt: newReview.updatedAt.toISOString().replace('T', ' ').substring(0, 19)
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
const validateBooking = [
    check('startDate')
        .exists()
        .isAfter()
        .withMessage('Cannot create a booking in the past'),

    check('endDate')
        .exists()
        .isAfter()
        .withMessage('Cannot create a booking in the past')
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value);

            if (endDate <= startDate) {
                throw new Error("endDate cannot be on or before startDate");
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