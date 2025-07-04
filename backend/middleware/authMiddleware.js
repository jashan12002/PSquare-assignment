const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      console.log("token",token);

      // Verify token
      const decoded = jwt.verify(token, "super_secret_key");

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      // Check token expiration (2 hours)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({ message: 'Session expired, please login again' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to verify HR role
const hrOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, HR access only' });
  }
};

module.exports = { protect, hrOnly }; 