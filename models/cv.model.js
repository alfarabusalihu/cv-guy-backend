const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  content: {
    type: Buffer,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cv', cvSchema);