const express = require('express');
const router = express.Router();

/**
 * GET /api/dashboard
 * Get dashboard data for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Mock dashboard data - in production, this would come from database
    const dashboardData = {
      academicPassport: {
        totalCredits: 120,
        completedCourses: 40,
        gpa: 3.8,
        institutions: [
          'Harvard University',
          'Stanford University',
          'MIT'
        ],
        skills: [
          'Machine Learning',
          'Data Science',
          'Blockchain Development',
          'Software Engineering',
          'Artificial Intelligence'
        ]
      },
      verifiedCredits: 95,
      pathwaySuggestions: [
        {
          id: 'pathway-1',
          title: 'AI/ML Specialization',
          description: 'Advanced pathway in artificial intelligence and machine learning',
          confidence: 85,
          courses: ['Advanced ML', 'Deep Learning', 'NLP']
        },
        {
          id: 'pathway-2',
          title: 'Blockchain Development',
          description: 'Comprehensive blockchain and smart contract development',
          confidence: 78,
          courses: ['Smart Contracts', 'DeFi Protocols', 'Web3 Development']
        },
        {
          id: 'pathway-3',
          title: 'Data Science',
          description: 'Complete data science and analytics pathway',
          confidence: 92,
          courses: ['Data Analysis', 'Statistics', 'Big Data']
        }
      ],
      recentActivity: [
        {
          id: 'activity-1',
          type: 'course_completed',
          title: 'Machine Learning Fundamentals',
          description: 'Successfully completed with grade A',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        },
        {
          id: 'activity-2',
          type: 'credential_issued',
          title: 'Blockchain Developer Certificate',
          description: 'Credential issued and verified on blockchain',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed'
        },
        {
          id: 'activity-3',
          type: 'application_submitted',
          title: 'MIT Transfer Application',
          description: 'Application submitted for Computer Science program',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          status: 'pending'
        },
        {
          id: 'activity-4',
          type: 'assessment_passed',
          title: 'Technical Skills Assessment',
          description: 'Passed with 85% score',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          status: 'completed'
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard data'
    });
  }
});

module.exports = router; 