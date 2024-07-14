// routes/subscription.js

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Subscription = require('../models/Subscription');

// Middleware for parsing application/json
router.use(bodyParser.json());

// Route: POST /api/subscribe
// Description: Subscribe a new email
router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email is already subscribed
        let subscription = await Subscription.findOne({ email });
        if (subscription) {
            return res.json({ message: 'Email is already subscribed' });
        }

        // Create new subscription
        subscription = new Subscription({
            email
        });

        // Save subscription to database
        await subscription.save();

        res.status(201).json({ message: 'Subscription successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
