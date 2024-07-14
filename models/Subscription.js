// models/Subscription.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
