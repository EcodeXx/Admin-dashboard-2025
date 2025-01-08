const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { Buffer } = require('buffer');  // Import Buffer from the 'buffer' module

const app = express();
const port = 3000;

// Set up body-parser to handle JSON requests
app.use(bodyParser.json());  // To parse application/json

// Endpoint to handle image upload (Base64 encoding)
app.post('/upload', (req, res) => {
  const { fingerprintImage } = req.body;  // Get fingerprintImage from the request body

  if (!fingerprintImage) {
    return res.status(400).json({ message: 'No fingerprint image received' });
  }

  // Convert the Base64 image string to binary data (Buffer)
  const imageBuffer = Buffer.from(fingerprintImage, 'base64');

  // Generate a unique filename (you can modify this to suit your needs)
  const filename = `fingerprint_${Date.now()}.png`;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Save the image data as a PNG file
  fs.writeFile(filePath, imageBuffer, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving image' });
    }

    // Respond with the uploaded image path
    res.json({
      message: 'Image uploaded successfully!',
      imagePath: `/uploads/${filename}`
    });
  });
});

// Serve uploaded images from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
