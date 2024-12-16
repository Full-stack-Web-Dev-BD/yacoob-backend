// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pageRoutes = require('./routes/pageRouter');
const multer= require("multer")
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
// 
// mongodb+srv://2E9Qci1zFwdZtIqa:2E9Qci1zFwdZtIqa@cluster0.3vqdhfr.mongodb.net/yacoobaa?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb+srv://admin:ZCUxFbWAMB5WOJUJ@cluster0.3vqdhfr.mongodb.net/brandi?retryWrites=true&w=majority&appName=Cluster0").then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName); // File name is set to current timestamp + original file name
  }
});

const upload = multer({ storage: storage });

// Define a POST route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).send('No files were uploaded.');
      }
      // File uploaded successfully, send response with file details
      res.send({
          message: 'File uploaded successfully',
          filename: req.file.filename,
          path: req.file.path
      });
  } catch (err) {
      res.status(500).send(err.message);
  }
});


// Routes
app.use('/api/pages', pageRoutes);
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/sub', require('./routes/subscription'));

// Serve static files from the 'uploads' folder
app.use('/', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
