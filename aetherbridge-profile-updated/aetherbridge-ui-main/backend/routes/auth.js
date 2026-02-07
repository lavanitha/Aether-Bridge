const express = require('express');
const router = express.Router();

/**
 * POST /api/auth/login
 * User login (handled by Firebase on frontend)
 */
router.post('/login', async (req, res) => {
  try {
    // Firebase handles authentication on frontend
    // This endpoint is for additional server-side logic if needed
    res.json({
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * POST /api/auth/signup
 * User registration (handled by Firebase on frontend)
 */
router.post('/signup', async (req, res) => {
  try {
    // Firebase handles registration on frontend
    // This endpoint is for additional server-side logic if needed
    res.json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

module.exports = router; 