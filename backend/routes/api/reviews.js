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
    const reviewsResponse = {
        Reviews: modifiedReviews
    }

    return res.status(200).json(reviewsResponse);
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const numImages = await ReviewImage.count({
        where: {
            reviewId
        }
    });

    if (numImages >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
    };

    const newImage = await ReviewImage.create({
        reviewId,
        url
    });

    delete newImage.dataValues.reviewId;
    delete newImage.dataValues.createdAt;
    delete newImage.dataValues.updatedAt;

    return res.json(newImage)
});


//Edit a Review
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.put('/:reviewId', validateReview, requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const currentReview = await Review.findByPk(reviewId);
    if (!currentReview) {
        res.status(404).json({ message: 'Review not found' })
    };

    if (currentReview.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" })
    }


    const newReview = await currentReview.update({
        stars,
        review
    });
    return res.json(newReview);
})

//Delete a Review

router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res) => {

        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" })
        };

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" })
        };

        await review.destroy();

        return res.json({ message: "Successfully Deleted" })
    }
)
module.exports = router;

