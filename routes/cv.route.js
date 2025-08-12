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
      email
    });

    await cv.save();
    res.status(200).json({ message: 'CV uploaded successfully', email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const latestCv = await Cv.findOne().sort({ uploadedAt: -1 });
    if (!latestCv) {
      return res.status(404).json({ error: 'No CV found' });
    }
    res.status(200).json(latestCv);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch CV' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    await Cv.deleteMany();
    res.status(200).json({ message: 'CV deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

module.exports = router;
