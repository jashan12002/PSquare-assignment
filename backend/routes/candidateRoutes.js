const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateStatus,
  deleteCandidate,
  moveToEmployee,
  downloadResume,
} = require('../controllers/candidateController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

// Configure multer storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Resume files only (PDF, DOC, DOCX)!');
  }
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 }, // 10MB max
});

// Get all candidates
router.get('/', protect, hrOnly, getCandidates);

// Get candidate by ID
router.get('/:id', protect, hrOnly, getCandidateById);

// Create candidate
router.post('/', protect, hrOnly, upload.single('resume'), createCandidate);

// Update candidate status
router.put('/:id', protect, hrOnly, updateCandidateStatus);

// Delete candidate
router.delete('/:id', protect, hrOnly, deleteCandidate);

// Move candidate to employee
router.post('/:id/hire', protect, hrOnly, moveToEmployee);

// Download resume
router.get('/:id/resume', protect, hrOnly, downloadResume);

module.exports = router; 