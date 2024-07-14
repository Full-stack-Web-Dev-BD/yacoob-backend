// models/page.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    img: { type: [String] }, // Array of strings for images
    txt: { type: [String] }  // Array of strings for texts
});

const pageSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true },
    content: [sectionSchema]
});

module.exports = mongoose.model('Page', pageSchema);