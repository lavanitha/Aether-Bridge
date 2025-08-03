const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Mock data for development
const mockEvents = [
  {
    id: '1',
    title: 'EdTech Innovation Summit 2024',
    description: 'Join leading educators and technologists to explore the future of digital learning and academic mobility.',
    date: '2024-03-15T09:00:00Z',
    endDate: '2024-03-15T17:00:00Z',
    location: 'San Francisco Convention Center',
    virtualLocation: 'https://meet.aetherbridge.com/edtech-summit-2024',
    type: 'conference',
    category: 'Technology',
    registrationRequired: true,
    maxAttendees: 500,
    registeredUsers: ['user1', 'user2'],
    speakers: [
      { name: 'Dr. Sarah Johnson', title: 'AI in Education', institution: 'Stanford University' },
      { name: 'Prof. Michael Chen', title: 'Blockchain for Credentials', institution: 'MIT' }
    ],
    tags: ['EdTech', 'AI', 'Blockchain', 'Education'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Academic Credential Verification Workshop',
    description: 'Learn about the latest developments in credential verification and blockchain-based academic records.',
    date: '2024-03-20T14:00:00Z',
    endDate: '2024-03-20T16:00:00Z',
    location: 'Virtual Event',
    virtualLocation: 'https://meet.aetherbridge.com/credential-workshop',
    type: 'workshop',
    category: 'Blockchain',
    registrationRequired: true,
    maxAttendees: 100,
    registeredUsers: ['user1'],
    speakers: [
      { name: 'Dr. Emily Rodriguez', title: 'International Credential Recognition', institution: 'University of Toronto' }
    ],
    tags: ['Credentials', 'Blockchain', 'Verification'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    isFeatured: false
  },
  {
    id: '3',
    title: 'Student Mobility Fair',
    description: 'Connect with universities worldwide and explore study abroad opportunities.',
    date: '2024-04-10T10:00:00Z',
    endDate: '2024-04-10T18:00:00Z',
    location: 'New York University',
    virtualLocation: 'https://meet.aetherbridge.com/mobility-fair',
    type: 'fair',
    category: 'Mobility',
    registrationRequired: false,
    maxAttendees: 1000,
    registeredUsers: [],
    speakers: [],
    tags: ['Study Abroad', 'Universities', 'Mobility'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=400&h=200&fit=crop',
    isFeatured: true
  },
  {
    id: '4',
    title: 'AI-Powered Learning Analytics Webinar',
    description: 'Discover how artificial intelligence is transforming learning analytics and student success prediction.',
    date: '2024-03-25T15:00:00Z',
    endDate: '2024-03-25T16:30:00Z',
    location: 'Virtual Event',
    virtualLocation: 'https://meet.aetherbridge.com/ai-analytics-webinar',
    type: 'webinar',
    category: 'AI',
    registrationRequired: true,
    maxAttendees: 200,
    registeredUsers: ['user2'],
    speakers: [
      { name: 'Dr. Alex Thompson', title: 'AI in Learning Analytics', institution: 'Harvard University' }
    ],
    tags: ['AI', 'Analytics', 'Learning'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    isFeatured: false
  }
];

// Get all events
router.get('/', async (req, res) => {
  try {
    const { type, category, featured, upcoming } = req.query;
    
    let filteredEvents = [...mockEvents];
    
    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    if (featured === 'true') {
      filteredEvents = filteredEvents.filter(event => event.isFeatured);
    }
    
    if (upcoming === 'true') {
      const now = new Date();
      filteredEvents = filteredEvents.filter(event => new Date(event.date) > now);
    }
    
    // Sort by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: error.message
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = mockEvents.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
      message: error.message
    });
  }
});

// Register for event
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check if event is full
    if (event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        error: 'Event is full'
      });
    }
    
    // Check if user is already registered
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this event'
      });
    }
    
    // Add user to registered list
    event.registeredUsers.push(userId);
    
    const registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      eventTitle: event.title,
      userId,
      registrationDate: new Date().toISOString(),
      status: 'confirmed',
      meetingLink: event.virtualLocation,
      reminderSent: false
    };
    
    res.json({
      success: true,
      data: registration,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register for event',
      message: error.message
    });
  }
});

// Unregister from event
router.delete('/:id/unregister', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Remove user from registered list
    const userIndex = event.registeredUsers.indexOf(userId);
    if (userIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Not registered for this event'
      });
    }
    
    event.registeredUsers.splice(userIndex, 1);
    
    res.json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to unregister from event',
      message: error.message
    });
  }
});

// Set reminder for event
router.post('/:id/reminder', authenticateToken, async (req, res) => {
  try {
    const { reminderTime } = req.body; // minutes before event
    const eventId = req.params.id;
    const userId = req.user.id;
    
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    const reminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      eventTitle: event.title,
      userId,
      reminderTime: parseInt(reminderTime) || 30, // default 30 minutes
      reminderDate: new Date(new Date(event.date).getTime() - (parseInt(reminderTime) || 30) * 60000),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: reminder,
      message: 'Reminder set successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to set reminder',
      message: error.message
    });
  }
});

// Get user's registered events
router.get('/user/registered', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userEvents = mockEvents.filter(event => 
      event.registeredUsers.includes(userId)
    );
    
    res.json({
      success: true,
      data: userEvents,
      total: userEvents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user events',
      message: error.message
    });
  }
});

// Get event categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(mockEvents.map(event => event.category))];
    
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