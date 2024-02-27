const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, SpotImage, ReviewImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

//express-validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// DELETE endpoint to delete a spot image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id;
    const { imageId } = req.params;
    const spotImage = await SpotImage.findByPk(imageId);

    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
        });
    }

    const spot = await Spot.findByPk(spotImage.spotId);

    if (currentUserId === spot.ownerId) {
        await spotImage.destroy();
        return res.json({
            message: "Successfully deleted",
        });
    } else {
        res.status(403).json({
            message: "Forbidden"
        });
    }
});

module.exports = router;