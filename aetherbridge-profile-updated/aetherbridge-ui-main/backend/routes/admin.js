const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Mock applications data for development
const mockApplications = [
  {
    id: 'app1',
    userId: 'user1',
    studentName: 'John Doe',
    studentEmail: 'john.doe@example.com',
    status: 'pending',
    submittedAt: '2024-03-10T09:00:00Z',
    targetInstitution: 'MIT',
    targetProgram: 'Computer Science',
    transcripts: [
      {
        id: 'transcript1',
        filename: 'transcript_2024.pdf',
        url: 'https://aetherbridge.com/uploads/transcript1.pdf',
        uploadedAt: '2024-03-10T09:00:00Z'
      }
    ],
    equivalencyResults: null,
    adminComments: null,
    reviewedBy: null,
    reviewedAt: null,
    priority: 'medium'
  },
  {
    id: 'app2',
    userId: 'user2',
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@example.com',
    status: 'under_review',
    submittedAt: '2024-03-08T14:30:00Z',
    targetInstitution: 'Stanford University',
    targetProgram: 'Data Science',
    transcripts: [
      {
        id: 'transcript2',
        filename: 'transcript_jane.pdf',
        url: 'https://aetherbridge.com/uploads/transcript2.pdf',
        uploadedAt: '2024-03-08T14:30:00Z'
      }
    ],
    equivalencyResults: [
      {
        sourceCourse: 'Introduction to Programming',
        targetCourse: 'CS106A',
        confidenceScore: 85,
        verdict: 'equivalent',
        reasoning: 'Course content and learning outcomes match closely'
      }
    ],
    adminComments: 'Initial review completed. Waiting for final approval.',
    reviewedBy: 'admin1',
    reviewedAt: '2024-03-09T10:00:00Z',
    priority: 'high'
  },
  {
    id: 'app3',
    userId: 'user3',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@example.com',
    status: 'approved',
    submittedAt: '2024-03-05T11:15:00Z',
    targetInstitution: 'Harvard University',
    targetProgram: 'Business Administration',
    transcripts: [
      {
        id: 'transcript3',
        filename: 'transcript_mike.pdf',
        url: 'https://aetherbridge.com/uploads/transcript3.pdf',
        uploadedAt: '2024-03-05T11:15:00Z'
      }
    ],
    equivalencyResults: [
      {
        sourceCourse: 'Business Fundamentals',
        targetCourse: 'BUS101',
        confidenceScore: 90,
        verdict: 'equivalent',
        reasoning: 'Course content and credit hours match exactly'
      }
    ],
    adminComments: 'Application approved. All courses have been verified and mapped.',
    reviewedBy: 'admin1',
    reviewedAt: '2024-03-06T16:00:00Z',
    priority: 'medium'
  }
];

// Mock credentials for verification
const mockPendingCredentials = [
  {
    id: 'pending_cred1',
    userId: 'user1',
    type: 'course',
    title: 'Machine Learning Fundamentals',
    issuer: 'University of Toronto',
    submittedAt: '2024-03-12T10:00:00Z',
    documents: [
      {
        id: 'doc1',
        filename: 'ml_certificate.pdf',
        url: 'https://aetherbridge.com/uploads/ml_certificate.pdf',
        type: 'certificate'
      },
      {
        id: 'doc2',
        filename: 'transcript_ml.pdf',
        url: 'https://aetherbridge.com/uploads/transcript_ml.pdf',
        type: 'transcript'
      }
    ],
    metadata: {
      courseCode: 'CSC2515',
      credits: 3,
      grade: 'A-',
      instructor: 'Dr. Geoffrey Hinton',
      courseDescription: 'Introduction to machine learning algorithms and applications'
    },
    status: 'pending_verification',
    verifiedBy: null,
    verifiedAt: null,
    verificationNotes: null
  }
];

// Get pending applications
router.get('/applications/pending', authenticateToken, async (req, res) => {
  try {
    const { priority, institution } = req.query;
    
    let filteredApplications = mockApplications.filter(app => 
      app.status === 'pending' || app.status === 'under_review'
    );
    
    if (priority) {
      filteredApplications = filteredApplications.filter(app => app.priority === priority);
    }
    
    if (institution) {
      filteredApplications = filteredApplications.filter(app => 
        app.targetInstitution.toLowerCase().includes(institution.toLowerCase())
      );
    }
    
    // Sort by priority and submission date
    filteredApplications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });
    
    res.json({
      success: true,
      data: filteredApplications,
      total: filteredApplications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending applications',
      message: error.message
    });
  }
});

// Get all applications
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const { status, priority, institution, limit = 20, offset = 0 } = req.query;
    
    let filteredApplications = [...mockApplications];
    
    if (status) {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }
    
    if (priority) {
      filteredApplications = filteredApplications.filter(app => app.priority === priority);
    }
    
    if (institution) {
      filteredApplications = filteredApplications.filter(app => 
        app.targetInstitution.toLowerCase().includes(institution.toLowerCase())
      );
    }
    
    // Sort by submission date (newest first)
    filteredApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    const paginatedApplications = filteredApplications.slice(offset, offset + limit);
    
    res.json({
      success: true,
      data: paginatedApplications,
      pagination: {
        total: filteredApplications.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + limit < filteredApplications.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications',
      message: error.message
    });
  }
});

// Get application by ID
router.get('/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = mockApplications.find(app => app.id === req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application',
      message: error.message
    });
  }
});

// Approve application
router.post('/applications/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { equivalencyResults, comments } = req.body;
    const applicationId = req.params.id;
    const adminId = req.user.id;
    
    const application = mockApplications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    if (application.status === 'approved' || application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        error: 'Application has already been processed'
      });
    }
    
    // Update application
    application.status = 'approved';
    application.equivalencyResults = equivalencyResults || application.equivalencyResults;
    application.adminComments = comments;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: application,
      message: 'Application approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to approve application',
      message: error.message
    });
  }
});

// Reject application
router.post('/applications/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { reason, comments } = req.body;
    const applicationId = req.params.id;
    const adminId = req.user.id;
    
    const application = mockApplications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    if (application.status === 'approved' || application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        error: 'Application has already been processed'
      });
    }
    
    // Update application
    application.status = 'rejected';
    application.adminComments = comments;
    application.rejectionReason = reason;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: application,
      message: 'Application rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reject application',
      message: error.message
    });
  }
});

// Request changes for application
router.post('/applications/:id/request-changes', authenticateToken, async (req, res) => {
  try {
    const { requestedChanges, comments } = req.body;
    const applicationId = req.params.id;
    const adminId = req.user.id;
    
    const application = mockApplications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    if (application.status === 'approved' || application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        error: 'Application has already been processed'
      });
    }
    
    // Update application
    application.status = 'changes_requested';
    application.requestedChanges = requestedChanges;
    application.adminComments = comments;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: application,
      message: 'Changes requested successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to request changes',
      message: error.message
    });
  }
});

// Get pending credentials for verification
router.get('/credentials/pending', authenticateToken, async (req, res) => {
  try {
    const { type, issuer } = req.query;
    
    let filteredCredentials = mockPendingCredentials.filter(cred => 
      cred.status === 'pending_verification'
    );
    
    if (type) {
      filteredCredentials = filteredCredentials.filter(cred => cred.type === type);
    }
    
    if (issuer) {
      filteredCredentials = filteredCredentials.filter(cred => 
        cred.issuer.toLowerCase().includes(issuer.toLowerCase())
      );
    }
    
    // Sort by submission date (oldest first for FIFO)
    filteredCredentials.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    
    res.json({
      success: true,
      data: filteredCredentials,
      total: filteredCredentials.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending credentials',
      message: error.message
    });
  }
});

// Verify and anchor credential
router.post('/credentials/verify-and-anchor', authenticateToken, async (req, res) => {
  try {
    const { credentialId, verificationNotes, blockchainNetwork = 'ethereum' } = req.body;
    const adminId = req.user.id;
    
    const credential = mockPendingCredentials.find(cred => cred.id === credentialId);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    if (credential.status !== 'pending_verification') {
      return res.status(400).json({
        success: false,
        error: 'Credential is not pending verification'
      });
    }
    
    // Mock blockchain anchoring
    const blockchainHash = '0x' + require('crypto').randomBytes(32).toString('hex');
    const transactionHash = '0x' + require('crypto').randomBytes(32).toString('hex');
    
    // Create verified credential
    const verifiedCredential = {
      id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: credential.userId,
      type: credential.type,
      title: credential.title,
      issuer: credential.issuer,
      issuerDid: `did:ethr:${require('crypto').randomBytes(20).toString('hex')}`,
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 3 years
      blockchainHash,
      transactionHash,
      status: 'verified',
      metadata: credential.metadata,
      verificationUrl: `https://aetherbridge.com/verify/${credential.id}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aetherbridge.com/verify/${credential.id}`,
      verifiedBy: adminId,
      verifiedAt: new Date().toISOString(),
      verificationNotes
    };
    
    // Update credential status
    credential.status = 'verified';
    credential.verifiedBy = adminId;
    credential.verifiedAt = new Date().toISOString();
    credential.verificationNotes = verificationNotes;
    
    res.json({
      success: true,
      data: verifiedCredential,
      message: 'Credential verified and anchored to blockchain successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to verify and anchor credential',
      message: error.message
    });
  }
});

// Get admin dashboard statistics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = {
      applications: {
        total: mockApplications.length,
        pending: mockApplications.filter(app => app.status === 'pending').length,
        underReview: mockApplications.filter(app => app.status === 'under_review').length,
        approved: mockApplications.filter(app => app.status === 'approved').length,
        rejected: mockApplications.filter(app => app.status === 'rejected').length,
        changesRequested: mockApplications.filter(app => app.status === 'changes_requested').length
      },
      credentials: {
        total: mockPendingCredentials.length,
        pendingVerification: mockPendingCredentials.filter(cred => cred.status === 'pending_verification').length,
        verified: mockPendingCredentials.filter(cred => cred.status === 'verified').length
      },
      recentActivity: [
        {
          id: 'activity1',
          type: 'application_approved',
          title: 'Application Approved',
          description: 'John Doe\'s application to MIT was approved',
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: 'activity2',
          type: 'credential_verified',
          title: 'Credential Verified',
          description: 'Machine Learning Fundamentals credential was verified',
          timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        }
      ]
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: error.message
    });
  }
});

// Get application statistics
router.get('/applications/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      byStatus: mockApplications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
      byInstitution: mockApplications.reduce((acc, app) => {
        acc[app.targetInstitution] = (acc[app.targetInstitution] || 0) + 1;
        return acc;
      }, {}),
      byPriority: mockApplications.reduce((acc, app) => {
        acc[app.priority] = (acc[app.priority] || 0) + 1;
        return acc;
      }, {}),
      averageProcessingTime: '2.5 days', // Mock calculation
      approvalRate: Math.round((mockApplications.filter(app => app.status === 'approved').length / mockApplications.length) * 100)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application statistics',
      message: error.message
    });
  }
});

module.exports = router; 