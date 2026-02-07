const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Mock data for development
const mockAssessments = [
  {
    id: '1',
    title: 'Technical Skills Assessment',
    type: 'technical',
    category: 'Programming',
    duration: 60, // minutes
    questionCount: 20,
    description: 'Comprehensive assessment of programming and technical skills including algorithms, data structures, and software development practices.',
    skills: ['JavaScript', 'Python', 'Data Structures', 'Algorithms', 'System Design'],
    difficulty: 'intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the time complexity of binary search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'Binary search has logarithmic time complexity as it divides the search space in half with each iteration.'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Which data structure is best for implementing a queue?',
        options: ['Array', 'Linked List', 'Stack', 'Tree'],
        correctAnswer: 1,
        explanation: 'Linked lists provide O(1) insertion and deletion at both ends, making them ideal for queue implementation.'
      },
      {
        id: 'q3',
        type: 'code',
        question: 'Write a function to reverse a string in JavaScript.',
        language: 'javascript',
        testCases: [
          { input: '"hello"', output: '"olleh"' },
          { input: '"world"', output: '"dlrow"' }
        ],
        template: 'function reverseString(str) {\n  // Your code here\n}'
      }
    ],
    isActive: true
  },
  {
    id: '2',
    title: 'Critical Thinking Assessment',
    type: 'critical_thinking',
    category: 'Analytical',
    duration: 45,
    questionCount: 15,
    description: 'Evaluate your analytical and critical thinking abilities through scenario-based questions.',
    skills: ['Problem Solving', 'Logical Reasoning', 'Data Analysis', 'Decision Making'],
    difficulty: 'advanced',
    passingScore: 75,
    questions: [
      {
        id: 'q1',
        type: 'scenario',
        question: 'A company is experiencing declining sales. As a consultant, what would be your first step in analyzing the problem?',
        options: [
          'Immediately cut costs',
          'Analyze sales data and customer feedback',
          'Blame the sales team',
          'Increase marketing budget'
        ],
        correctAnswer: 1,
        explanation: 'Data-driven analysis should always be the first step in problem-solving.'
      }
    ],
    isActive: true
  },
  {
    id: '3',
    title: 'Leadership Skills Assessment',
    type: 'leadership',
    category: 'Soft Skills',
    duration: 30,
    questionCount: 12,
    description: 'Assess your leadership potential and team management capabilities.',
    skills: ['Communication', 'Team Management', 'Conflict Resolution', 'Strategic Thinking'],
    difficulty: 'intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'situation',
        question: 'A team member is consistently missing deadlines. How would you address this?',
        options: [
          'Immediately fire them',
          'Have a private conversation to understand the issue',
          'Complain to HR',
          'Ignore the problem'
        ],
        correctAnswer: 1,
        explanation: 'Open communication and understanding the root cause is essential for effective leadership.'
      }
    ],
    isActive: true
  }
];

// Mock assessment results
const mockResults = [
  {
    id: 'result1',
    assessmentId: '1',
    assessmentTitle: 'Technical Skills Assessment',
    userId: 'user1',
    score: 85,
    maxScore: 100,
    completedAt: '2024-03-10T14:30:00Z',
    duration: 45, // minutes taken
    skillsIdentified: ['JavaScript', 'Python', 'Data Structures'],
    missingSkills: ['System Design', 'Advanced Algorithms'],
    recommendations: [
      'Take Advanced Data Structures course',
      'Practice system design problems',
      'Review algorithm optimization techniques'
    ],
    detailedResults: {
      correctAnswers: 17,
      totalQuestions: 20,
      categoryScores: {
        'JavaScript': 90,
        'Python': 85,
        'Data Structures': 80,
        'Algorithms': 75,
        'System Design': 60
      }
    }
  }
];

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const { type, category, difficulty } = req.query;
    
    let filteredAssessments = mockAssessments.filter(assessment => assessment.isActive);
    
    if (type) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.type === type);
    }
    
    if (category) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.category === category);
    }
    
    if (difficulty) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.difficulty === difficulty);
    }
    
    res.json({
      success: true,
      data: filteredAssessments,
      total: filteredAssessments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assessments',
      message: error.message
    });
  }
});

// Get assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessment = mockAssessments.find(a => a.id === req.params.id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      });
    }
    
    // Don't include questions in the basic fetch
    const { questions, ...assessmentWithoutQuestions } = assessment;
    
    res.json({
      success: true,
      data: assessmentWithoutQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assessment',
      message: error.message
    });
  }
});

// Start assessment
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const userId = req.user.id;
    
    const assessment = mockAssessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      });
    }
    
    // Check if user has already completed this assessment recently
    const existingResult = mockResults.find(r => 
      r.assessmentId === assessmentId && 
      r.userId === userId &&
      new Date(r.completedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours
    );
    
    if (existingResult) {
      return res.status(400).json({
        success: false,
        error: 'Assessment already completed recently. Please wait 24 hours before retaking.'
      });
    }
    
    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create assessment session
    const session = {
      id: sessionId,
      assessmentId,
      userId,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + assessment.duration * 60 * 1000).toISOString(),
      status: 'in_progress',
      currentQuestion: 0,
      answers: [],
      timeRemaining: assessment.duration * 60 // seconds
    };
    
    res.json({
      success: true,
      data: {
        sessionId,
        assessment: {
          id: assessment.id,
          title: assessment.title,
          duration: assessment.duration,
          questionCount: assessment.questionCount,
          questions: assessment.questions
        },
        startTime: session.startTime,
        endTime: session.endTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start assessment',
      message: error.message
    });
  }
});

// Submit assessment
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { sessionId, answers } = req.body;
    const userId = req.user.id;
    
    // Find the assessment based on session
    const assessment = mockAssessments.find(a => a.id === sessionId.split('_')[1]);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const detailedResults = {
      correctAnswers: 0,
      totalQuestions: assessment.questions.length,
      categoryScores: {}
    };
    
    answers.forEach((answer, index) => {
      const question = assessment.questions[index];
      if (question && answer.answer === question.correctAnswer) {
        correctAnswers++;
        detailedResults.correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / assessment.questions.length) * 100);
    const passed = score >= assessment.passingScore;
    
    // Identify skills and generate recommendations
    const skillsIdentified = assessment.skills.filter((_, index) => {
      const questionIndex = Math.floor(index * assessment.questions.length / assessment.skills.length);
      return answers[questionIndex] && answers[questionIndex].answer === assessment.questions[questionIndex].correctAnswer;
    });
    
    const missingSkills = assessment.skills.filter(skill => !skillsIdentified.includes(skill));
    
    const recommendations = [
      `Focus on improving ${missingSkills.join(', ')} skills`,
      'Practice with similar assessment questions',
      'Consider taking related courses'
    ];
    
    const result = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      userId,
      score,
      maxScore: 100,
      completedAt: new Date().toISOString(),
      duration: Math.floor(Math.random() * assessment.duration) + 20, // Mock duration
      skillsIdentified,
      missingSkills,
      recommendations,
      detailedResults,
      passed
    };
    
    // Save result
    mockResults.push(result);
    
    res.json({
      success: true,
      data: result,
      message: passed ? 'Congratulations! You passed the assessment.' : 'Assessment completed. Review your results and try again.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit assessment',
      message: error.message
    });
  }
});

// Get assessment results
router.get('/results', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userResults = mockResults.filter(result => result.userId === userId);
    
    res.json({
      success: true,
      data: userResults,
      total: userResults.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results',
      message: error.message
    });
  }
});

// Get specific result
router.get('/results/:id', authenticateToken, async (req, res) => {
  try {
    const result = mockResults.find(r => r.id === req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Result not found'
      });
    }
    
    // Check if user owns this result
    if (result.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch result',
      message: error.message
    });
  }
});

// Get assessment categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(mockAssessments.map(assessment => assessment.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

module.exports = router; 