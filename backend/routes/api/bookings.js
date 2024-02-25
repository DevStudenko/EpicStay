const express = require('express');
const router = express.Router();

const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//express-validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


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
        return res.json(bookings);
    }
});

module.exports = router;