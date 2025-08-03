const express = require('express');
const router = express.Router();
// const { aiService } = require('../services/ai');

/**
 * POST /api/equivalency/find
 * Find course equivalencies using AI
 */
router.post('/find', async (req, res) => {
  try {
    const { sourceCourses, targetInstitution } = req.body;
    const userId = req.user.uid;

    if (!sourceCourses || !Array.isArray(sourceCourses) || sourceCourses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Source courses array is required'
      });
    }

    if (!targetInstitution) {
      return res.status(400).json({
        success: false,
        error: 'Target institution is required'
      });
    }

    // Mock response for now (AI service disabled)
    const results = sourceCourses.map(course => ({
      sourceCourse: course,
      targetCourse: `${course} - Equivalent`,
      confidence: 0.85,
      institution: targetInstitution,
      status: 'pending'
    }));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Equivalency analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze course equivalencies'
    });
  }
});

module.exports = router; 