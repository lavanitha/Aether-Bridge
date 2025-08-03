const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = [
      {
        id: '1',
        title: 'Introduction to Computer Science',
        institution: 'Harvard University',
        category: 'Computer Science',
        credits: 3,
        description: 'Fundamental concepts of computer science and programming',
        equivalencyMetadata: {},
        isFeatured: true
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        institution: 'Stanford University',
        category: 'Artificial Intelligence',
        credits: 4,
        description: 'Introduction to machine learning algorithms and applications',
        equivalencyMetadata: {},
        isFeatured: true
      }
    ];
    
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get courses'
    });
  }
});

module.exports = router; 