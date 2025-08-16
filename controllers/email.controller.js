const nodemailer=require("nodemailer");
const fs = require('fs');
const Cv = require('../models/cv.model');

exports.sendEmail = async (req, res) => {
  try {
    const {subject, body } = req.body;

    const cv =  await Cv.findById(cvId);

    if (!cv || !cv.email) {
      return res.status(404).json({ error: 'No CV or email found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER, 
      to: cv.email,
      subject,
      text: body
    });

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

