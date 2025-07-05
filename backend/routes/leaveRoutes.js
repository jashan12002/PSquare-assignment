const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createLeave,
  getLeaves,
  getApprovedLeaves,
  getLeavesByEmployee,
  updateLeaveStatus,
  deleteLeave,
} = require('../controllers/leaveController');
const { protect, hrOnly } = require('../middleware/authMiddleware');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Documents only!');
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 }, // 10MB max
});


router.get('/', protect, hrOnly, getLeaves);


router.get('/approved', protect, hrOnly, getApprovedLeaves);


router.get('/employee/:id', protect, hrOnly, getLeavesByEmployee);


router.post('/', protect, hrOnly, upload.single('document'), createLeave);


router.put('/:id', protect, hrOnly, updateLeaveStatus);


router.delete('/:id', protect, hrOnly, deleteLeave);

module.exports = router; 