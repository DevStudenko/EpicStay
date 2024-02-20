const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review } = require('../../db/models');



router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();
    return res.json(spots);
});

module.exports = router;