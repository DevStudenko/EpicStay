const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: {
            model: SpotImage
        }
    });
    let spotObj;
    spots.forEach(spot => {
        spotObj = spot.toJSON();
        spotObj.previewImage = spotObj.SpotImages[0].url;
        delete spotObj.SpotImages;
    })

    return res.json(spotObj);
});

module.exports = router;