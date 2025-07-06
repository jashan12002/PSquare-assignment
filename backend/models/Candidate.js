const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled','Ongoing', 'Selected', 'Rejected', 'New'],
    default: 'New',
  },
  experience: {
    type: String,
  },
  resume: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate; 