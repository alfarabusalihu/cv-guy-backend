const express = require('express');
const multer = require('multer');
const router = express.Router();
const Cv = require('../models/cv.model');
const pdfParse = require('pdf-parse');
const storage = multer.memoryStorage();
const upload = multer({ storage });

function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

router.post('/', upload.single('cv'), async (req, res) => {
  try {
    await Cv.deleteMany(); 

    const pdfData = await pdfParse(req.file.buffer);
    const email = extractEmail(pdfData.text);

    if (!email) {
      return res.status(400).json({ error: 'No email found in CV' });
    }

    const cv = new Cv({
      fileName: req.file.originalname,
      content: req.file.buffer,
      contentType: req.file.mimetype,
      uploadedAt: new Date(),
      email
    });

    await cv.save();
    res.status(200).json({ message: 'CV uploaded successfully', email, cvId: cv._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Cv.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'CV deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

module.exports = router;
