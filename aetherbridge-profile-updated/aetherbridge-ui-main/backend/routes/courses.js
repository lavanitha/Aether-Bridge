const express = require('express');
const router = express.Router();

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
  }
});

module.exports = router; 