const express = require('express');
const router = express.Router();
const { dbUtils, storageMode } = require('../services/database');

cursor/implement-full-stack-academic-credentialing-platform-109e
// Import database utilities
const { dbUtils, storageMode } = require('../services/database');

// Helper: pick the correct DB utility set based on active storage mode
function getDb() {
  const mode = storageMode();
  if (mode === 'mongodb') return dbUtils.mongo;
  if (mode === 'postgresql') return dbUtils.postgres;
  return dbUtils.memory; // default in-memory
}

// GET /api/courses
// Supports filtering, search, sorting, limiting
router.get('/', async (req, res) => {
  try {
    const { category, institution, featured, search, limit, sort, order } = req.query;
    const db = getDb();

    // Build equality filters first
    const query = {};
    if (category) query.category = category;
    if (institution) query.institution = institution;

    // Fetch from storage (may be in-memory, mongo, or postgres)
    let courses = await db.find('courses', query);

    // Featured filter (boolean as string)
    if (featured === 'true') {
      courses = courses.filter((c) => c.isFeatured);
    }

    // Full-text style search over title / description
    if (search) {
      const s = search.toString().toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(s) ||
          (c.description && c.description.toLowerCase().includes(s))
      );
    }

    // Sorting
    if (sort) {
      const asc = (order || 'asc').toString().toLowerCase() === 'asc';
      courses.sort((a, b) => {
        if (a[sort] === undefined || b[sort] === undefined) return 0;
        if (a[sort] > b[sort]) return asc ? 1 : -1;
        if (a[sort] < b[sort]) return asc ? -1 : 1;
        return 0;
      });
    }

    // Limiting
    let total = courses.length;
    if (limit) {
      const l = parseInt(limit, 10);
      if (!isNaN(l)) courses = courses.slice(0, l);
    }

    res.json({ success: true, total, data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: 'Failed to get courses' });
  }
});

// GET /api/courses/:id – Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const course = await db.findOne('courses', { id: req.params.id });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error fetching course by id:', error);
    res.status(500).json({ success: false, error: 'Failed to get course' });
  }
});

// POST /api/courses/:id/enroll – Enroll current user in a course
// This route is protected; if auth middleware adds req.user, we can access it.
router.post('/:id/enroll', async (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const courseId = req.params.id;

    // In a full implementation we would update enrollment records.
    // For now, just respond with success so frontend buttons become active.
    res.json({ success: true, message: `User ${userId} enrolled in course ${courseId}` });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ success: false, error: 'Failed to enroll in course' });
=======
// Sample course data
const sampleCourses = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    institution: 'Harvard University',
    category: 'Computer Science',
    credits: 3,
    description: 'Fundamental concepts of computer science and programming',
    duration: '12 weeks',
    level: 'beginner',
    price: 299,
    rating: 4.8,
    enrollmentCount: 1250,
    isFeatured: true,
    isEnrolled: false,
    syllabus: [
      'Variables and Data Types',
      'Control Structures',
      'Functions and Methods',
      'Object-Oriented Programming',
      'Data Structures',
      'Algorithms and Complexity'
    ],
    prerequisites: ['Basic mathematics', 'No prior programming experience required'],
    learningOutcomes: [
      'Understand fundamental programming concepts',
      'Write clean, efficient code',
      'Solve problems using algorithms',
      'Work with data structures'
    ],
    instructors: [
      {
        name: 'Dr. Sarah Johnson',
        title: 'Professor of Computer Science',
        institution: 'Harvard University',
        bio: 'Leading researcher in computer science education'
      }
    ],
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    certificate: true,
    blockchain: true,
    equivalencyMetadata: {}
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    institution: 'Stanford University',
    category: 'Artificial Intelligence',
    credits: 4,
    description: 'Introduction to machine learning algorithms and applications',
    duration: '16 weeks',
    level: 'intermediate',
    price: 499,
    rating: 4.9,
    enrollmentCount: 890,
    isFeatured: true,
    isEnrolled: false,
    syllabus: [
      'Supervised Learning',
      'Unsupervised Learning',
      'Neural Networks',
      'Deep Learning',
      'Model Evaluation',
      'Real-world Applications'
    ],
    prerequisites: ['Python programming', 'Linear algebra', 'Calculus'],
    learningOutcomes: [
      'Implement ML algorithms from scratch',
      'Use popular ML frameworks',
      'Evaluate model performance',
      'Apply ML to real problems'
    ],
    instructors: [
      {
        name: 'Prof. Michael Chen',
        title: 'Associate Professor',
        institution: 'Stanford University',
        bio: 'Expert in machine learning and AI'
      }
    ],
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    certificate: true,
    blockchain: true,
    equivalencyMetadata: {}
  },
  {
    id: '3',
    title: 'Blockchain Technology',
    institution: 'MIT',
    category: 'Blockchain',
    credits: 3,
    description: 'Understanding blockchain technology and its applications',
    duration: '10 weeks',
    level: 'intermediate',
    price: 399,
    rating: 4.7,
    enrollmentCount: 650,
    isFeatured: true,
    isEnrolled: false,
    syllabus: [
      'Cryptography Basics',
      'Distributed Systems',
      'Consensus Mechanisms',
      'Smart Contracts',
      'DeFi Applications',
      'Blockchain Security'
    ],
    prerequisites: ['Basic programming', 'Understanding of networks'],
    learningOutcomes: [
      'Understand blockchain architecture',
      'Develop smart contracts',
      'Analyze blockchain security',
      'Explore DeFi applications'
    ],
    instructors: [
      {
        name: 'Dr. Alex Rodriguez',
        title: 'Research Scientist',
        institution: 'MIT',
        bio: 'Blockchain researcher and educator'
      }
    ],
    startDate: '2024-01-20',
    endDate: '2024-03-30',
    certificate: true,
    blockchain: true,
    equivalencyMetadata: {}
  },
  {
    id: '4',
    title: 'Data Science Essentials',
    institution: 'UC Berkeley',
    category: 'Data Science',
    credits: 4,
    description: 'Comprehensive introduction to data science and analytics',
    duration: '14 weeks',
    level: 'intermediate',
    price: 449,
    rating: 4.6,
    enrollmentCount: 1100,
    isFeatured: false,
    isEnrolled: false,
    syllabus: [
      'Data Collection and Cleaning',
      'Exploratory Data Analysis',
      'Statistical Modeling',
      'Data Visualization',
      'Predictive Analytics',
      'Big Data Technologies'
    ],
    prerequisites: ['Statistics', 'Python or R programming'],
    learningOutcomes: [
      'Clean and prepare data',
      'Perform statistical analysis',
      'Create compelling visualizations',
      'Build predictive models'
    ],
    instructors: [
      {
        name: 'Prof. Emily Davis',
        title: 'Professor of Statistics',
        institution: 'UC Berkeley',
        bio: 'Expert in statistical modeling and data science'
      }
    ],
    startDate: '2024-02-15',
    endDate: '2024-05-25',
    certificate: true,
    blockchain: false,
    equivalencyMetadata: {}
  },
  {
    id: '5',
    title: 'Cybersecurity Fundamentals',
    institution: 'Carnegie Mellon University',
    category: 'Cybersecurity',
    credits: 3,
    description: 'Essential cybersecurity concepts and practices',
    duration: '12 weeks',
    level: 'beginner',
    price: 349,
    rating: 4.5,
    enrollmentCount: 750,
    isFeatured: false,
    isEnrolled: false,
    syllabus: [
      'Security Principles',
      'Network Security',
      'Cryptography',
      'Web Security',
      'Incident Response',
      'Security Policies'
    ],
    prerequisites: ['Basic networking knowledge'],
    learningOutcomes: [
      'Identify security threats',
      'Implement security measures',
      'Respond to security incidents',
      'Develop security policies'
    ],
    instructors: [
      {
        name: 'Dr. Robert Wilson',
        title: 'Cybersecurity Professor',
        institution: 'Carnegie Mellon University',
        bio: 'Leading expert in cybersecurity education'
      }
    ],
    startDate: '2024-03-01',
    endDate: '2024-05-25',
    certificate: true,
    blockchain: true,
    equivalencyMetadata: {}
  }
];

// Get all courses with filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, level, institution, sortBy } = req.query;
    
    let filteredCourses = [...sampleCourses];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.institution.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    // Apply level filter
    if (level && level !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.level === level);
    }
    
    // Apply institution filter
    if (institution && institution !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.institution === institution);
    }
    
    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'rating':
          filteredCourses.sort((a, b) => b.rating - a.rating);
          break;
        case 'price':
          filteredCourses.sort((a, b) => a.price - b.price);
          break;
        case 'duration':
          filteredCourses.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
          break;
        case 'enrollment':
          filteredCourses.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
          break;
        default:
          filteredCourses.sort((a, b) => b.rating - a.rating);
      }
    }
    
    res.json({
      success: true,
      data: filteredCourses
    });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get courses'
    });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = sampleCourses.find(c => c.id === id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get course'
    });
  }
});

// Get enrolled courses for current user
router.get('/enrolled', async (req, res) => {
  try {
    // In a real implementation, this would query the database for user's enrolled courses
    const enrolledCourses = sampleCourses.slice(0, 2).map(course => ({
      ...course,
      isEnrolled: true,
      progress: Math.floor(Math.random() * 100)
    }));
    
    res.json({
      success: true,
      data: enrolledCourses
    });
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get enrolled courses'
    });
  }
});

// Enroll in a course
router.post('/:id/enroll', async (req, res) => {
  try {
    const { id } = req.params;
    const course = sampleCourses.find(c => c.id === id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    // In a real implementation, this would add the enrollment to the database
    console.log(`User enrolled in course: ${course.title}`);
    
    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId: id,
        enrollmentDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll in course'
    });
  }
});

// Get course progress
router.get('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would query the database for user's progress
    const progress = {
      progress: Math.floor(Math.random() * 100),
      completedLessons: Math.floor(Math.random() * 20),
      totalLessons: 20
    };
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error getting course progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get course progress'
    });
  }
});

// Get course equivalencies
router.get('/:id/equivalencies', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would query the AI service for equivalencies
    const equivalencies = [
      {
        institution: 'University of Toronto',
        course: 'Introduction to Programming',
        confidence: 0.85,
        credits: 3
      },
      {
        institution: 'University of British Columbia',
        course: 'Computer Science Fundamentals',
        confidence: 0.78,
        credits: 3
      }
    ];
    
    res.json({
      success: true,
      data: equivalencies
    });
  } catch (error) {
    console.error('Error getting course equivalencies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get course equivalencies'
    });
  }
});

// Get course categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(sampleCourses.map(course => course.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    });
  }
});

// Get course institutions
router.get('/institutions', async (req, res) => {
  try {
    const institutions = [...new Set(sampleCourses.map(course => course.institution))];
    
    res.json({
      success: true,
      data: institutions
    });
  } catch (error) {
    console.error('Error getting institutions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get institutions'
    });

  }
});

module.exports = router; 