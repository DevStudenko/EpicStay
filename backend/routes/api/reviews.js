const express = require('express');
const router = express.Router();
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.dataValues.id;
    const reviews = await Review.findAll({
        where: {
            userId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage,
                    attributes: ['id', 'url']
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    const modifiedReviews = reviews.map(review => {
        // Convert Sequelize instance to plain object
        const modifiedReview = review.toJSON();
        if (modifiedReview.Spot && modifiedReview.Spot.SpotImages && modifiedReview.Spot.SpotImages.length > 0) {
            modifiedReview.Spot.previewImage = modifiedReview.Spot.SpotImages[0].url;
            delete modifiedReview.Spot.SpotImages;
        }
        return modifiedReview;
    });


    return res.json(modifiedReviews);
});

module.exports = router;

