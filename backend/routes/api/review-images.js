const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, SpotImage, ReviewImage, Review } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

//express-validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// DELETE endpoint to delete a review image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        });
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    if (!review || review.userId !== req.user.id) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }

    await reviewImage.destroy();
    return res.json({
        message: 'Successfully deleted'
    });
});



module.exports = router;