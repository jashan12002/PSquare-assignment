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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


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


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 }, // 10MB max
});


router.get('/', protect, hrOnly, getCandidates);


router.get('/:id', protect, hrOnly, getCandidateById);


router.post('/', protect, hrOnly, upload.single('resume'), createCandidate);


router.put('/:id', protect, hrOnly, updateCandidateStatus);


router.delete('/:id', protect, hrOnly, deleteCandidate);


router.post('/:id/hire', protect, hrOnly, moveToEmployee);


router.get('/:id/resume', protect, hrOnly, downloadResume);

module.exports = router; 