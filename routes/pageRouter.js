const express = require('express');
const Page = require('../models/pageModel');
const router = express.Router();

// get all Page
// Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({});
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create a new page
router.post('/', async (req, res) => {
  const { page } = req.body;
  const pageName = page.toLowerCase();
  if (!page) {
    return res.json({ message: 'Page is required' });
  }

  try {
    const pageExist = await Page.findOne({ page: pageName });

    if (pageExist) {
      return res.status(400).json({ message: 'Page already exists' });
    }

    const newPage = new Page({ page: pageName, content: [] });

    const savedPage = await newPage.save();
    res.status(201).json(savedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// create new section
router.post('/page/section', async (req, res) => {
  const { page, img, txt } = req.body;
  const title = req.body.section.toLowerCase();
  const newSection = { title, img, txt };
  try {
    const existingPage = await Page.findOne({ page });

    if (!existingPage) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Check if the section already exists in the page
    const sectionExists = existingPage.content.some(
      section => section.title === title // Assuming sections have a 'title' field or unique identifier
    );

    if (sectionExists) {
      return res.status(400).json({ message: 'Section already exists' });
    }

    existingPage.content.push(newSection);

    const updatedPage = await existingPage.save();
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a section in a page
router.put('/page/section', async (req, res) => {
  const { page, img, txt } = req.body;
  const title = req.body.section.toLowerCase();
  const updatedSection = { title, img, txt };

  try {
    const pageDoc = await Page.findOne({ page });
    if (!pageDoc) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const sectionIndex = pageDoc.content.findIndex(sec => sec.title === title);
    if (sectionIndex === -1) {
      return res.status(404).json({ message: 'Section not found' });
    }

    pageDoc.content[sectionIndex] = {
      ...pageDoc.content[sectionIndex]._doc,
      ...updatedSection,
    };
    await pageDoc.save();

    res.json(pageDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
