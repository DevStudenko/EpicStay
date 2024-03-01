const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

//express-validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: {
            model: Spot,
            attributes: {
                exclude: ['description']
            },
            include: {
                model: SpotImage,
                attributes: ['url']
            }

        }
    });
    if (!bookings) {
        return res.json({
            message: "You currently don't have any bookings."
        });
    } else {
        bookings.forEach(booking => {
            booking.Spot.dataValues.previewImage = booking.Spot.dataValues.SpotImages[0].url;
            delete booking.Spot.dataValues.SpotImages
        });
        return res.json({ Bookings: bookings });
    }
});


// PUT endpoint to update a booking
const validateBookingUpdate = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .custom((value, { req }) => {
            if (new Date(value) < new Date()) {
                throw new Error('Start date cannot be in the past');
            }
            return true;
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End date cannot be on or before start date');
            }
            return true;
        }),
    handleValidationErrors
];


router.put('/:bookingId', requireAuth, validateBookingUpdate, async (req, res, next) => {
    const currentUserId = req.user.id;
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;
    const bookingById = await Booking.findByPk(bookingId);

    if (!bookingById) {
        return res.status(404).json({
            message: "Booking couldn't be found",
        });
    }

    if (currentUserId !== bookingById.userId) {
        return res.status(403).json({
            message: "Forbidden",
        });
    };

    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();
    const currentTime = new Date().getTime();

    if (currentTime > new Date(bookingById.endDate).getTime()) {
        return res.status(403).json({
            message: "Past bookings can't be modified",
        });
    }

    // Check for overlap with other bookings, excluding the current booking
    const otherBookings = await Booking.findAll({
        where: {
            id: {
                [Op.ne]: bookingId
            },
            spotId: bookingById.spotId
        }
    });

    let conflicts = {};
    let hasConflict = false;

    for (let otherBooking of otherBookings) {
        const otherStart = new Date(otherBooking.startDate).getTime();
        const otherEnd = new Date(otherBooking.endDate).getTime();

        if ((newStart < otherEnd && newEnd > otherStart) || (newStart === otherEnd || newEnd === otherStart)) {
            hasConflict = true;
            if (newStart <= otherEnd) {
                conflicts.startDate = "Start date conflicts with another booking";
            }
            if (newEnd >= otherStart) {
                conflicts.endDate = "End date conflicts with another booking";
            }
        }
    }

    if (hasConflict) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: conflicts,
        });
    }

    const updatedBooking = await bookingById.update({
        startDate,
        endDate
    });

    return res.json(updatedBooking);
});



//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id;
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        });
    }

    const spot = await Spot.findByPk(booking.spotId);

    if (booking.userId !== currentUserId && (!spot || spot.ownerId !== currentUserId)) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    const bookingStart = new Date(booking.startDate).getTime();
    const currentTime = new Date().getTime();

    if (currentTime >= bookingStart) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        });
    }

    await booking.destroy();

    res.status(200).json({
        message: "Successfully deleted"
    });
});

module.exports = router;