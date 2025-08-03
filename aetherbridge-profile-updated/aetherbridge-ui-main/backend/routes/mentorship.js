const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Mock data for development
const mockMentors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    expertise: ['Computer Science', 'Machine Learning', 'Data Science'],
    institution: 'Stanford University',
    bio: 'Senior Research Scientist with 15+ years in AI and ML. Former Google AI researcher.',
    availability: {
      monday: ['09:00', '17:00'],
      tuesday: ['10:00', '18:00'],
      wednesday: ['09:00', '17:00'],
      thursday: ['10:00', '18:00'],
      friday: ['09:00', '16:00']
    },
    rating: 4.8,
    hourlyRate: 150,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    expertise: ['Blockchain', 'Cryptography', 'Distributed Systems'],
    institution: 'MIT',
    bio: 'Blockchain researcher and educator. Led multiple Hyperledger Fabric projects.',
    availability: {
      monday: ['14:00', '20:00'],
      tuesday: ['09:00', '15:00'],
      wednesday: ['14:00', '20:00'],
      thursday: ['09:00', '15:00'],
      friday: ['14:00', '18:00']
    },
    rating: 4.9,
    hourlyRate: 180,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    expertise: ['Academic Mobility', 'International Education', 'Credential Evaluation'],
    institution: 'University of Toronto',
    bio: 'Expert in international academic credential recognition and mobility programs.',
    availability: {
      monday: ['10:00', '16:00'],
      tuesday: ['14:00', '20:00'],
      wednesday: ['10:00', '16:00'],
      thursday: ['14:00', '20:00'],
      friday: ['10:00', '14:00']
    },
    rating: 4.7,
    hourlyRate: 120,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const { expertise, institution, maxRate } = req.query;
    
    let filteredMentors = [...mockMentors];
    
    if (expertise) {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.expertise.some(exp => 
          exp.toLowerCase().includes(expertise.toLowerCase())
        )
      );
    }
    
    if (institution) {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.institution.toLowerCase().includes(institution.toLowerCase())
      );
    }
    
    if (maxRate) {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.hourlyRate <= parseInt(maxRate)
      );
    }
    
    res.json({
      success: true,
      data: filteredMentors,
      total: filteredMentors.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentors',
      message: error.message
    });
  }
});

// Get mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const mentor = mockMentors.find(m => m.id === req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor',
      message: error.message
    });
  }
});

// Book mentorship session
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { date, time, duration, topic, notes } = req.body;
    const mentorId = req.params.id;
    
    // Validate mentor exists
    const mentor = mockMentors.find(m => m.id === mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    // Validate availability (simplified check)
    const sessionDate = new Date(date);
    const dayOfWeek = sessionDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    if (!mentor.availability[dayOfWeek]) {
      return res.status(400).json({
        success: false,
        error: 'Mentor not available on this day'
      });
    }
    
    // Generate session ID and meeting link
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const meetingLink = `https://meet.aetherbridge.com/${sessionId}`;
    
    // Calculate cost
    const cost = mentor.hourlyRate * (duration / 60);
    
    const session = {
      id: sessionId,
      mentorId,
      mentorName: mentor.name,
      userId: req.user.id,
      date,
      time,
      duration,
      topic,
      notes,
      cost,
      meetingLink,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: session,
      message: 'Session booked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to book session',
      message: error.message
    });
  }
});

// Send message to mentor
router.post('/:id/message', authenticateToken, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const mentorId = req.params.id;
    
    // Validate mentor exists
    const mentor = mockMentors.find(m => m.id === mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    const messageData = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mentorId,
      mentorName: mentor.name,
      userId: req.user.id,
      subject,
      message,
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: messageData,
      message: 'Message sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: error.message
    });
  }
});

// Get mentor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const mentor = mockMentors.find(m => m.id === req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    res.json({
      success: true,
      data: mentor.availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch availability',
      message: error.message
    });
  }
});

module.exports = router; 