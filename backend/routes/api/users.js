const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();
//express-validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        // .withMessage('Please provide a username with at least 4 characters.'),
        // .isLength({ min: 4 })
        .withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    // check('password')
    //     .exists({ checkFalsy: true })
    //     .isLength({ min: 6 })
    //     .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last Name is required'),
    handleValidationErrors
];
// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        try {
            const user = await User.create({ email, username, hashedPassword, firstName, lastName });

            const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            };

            await setTokenCookie(res, safeUser);

            return res.json({
                user: safeUser
            });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const field = error.errors[0].path;
                const message = `User with that ${field} already exists`;
                return res.status(500).json({
                    message: "User already exists",
                    errors: {
                        [field]: message
                    }
                });
            }
            // Handle other errors
            return res.status(500).json({ message: "Something went wrong. Please try again." });
        }
    }
);


module.exports = router;