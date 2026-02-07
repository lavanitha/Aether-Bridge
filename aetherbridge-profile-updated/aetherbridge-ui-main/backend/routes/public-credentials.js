const express = require('express');
const router = express.Router();

// Mock credentials data for public verification
const mockPublicCredentials = [
  {
    id: 'cred1',
    userId: 'user1',
    type: 'course',
    title: 'Advanced Data Structures and Algorithms',
    issuer: 'Stanford University',
    issuerDid: 'did:ethr:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issueDate: '2024-01-15T10:00:00Z',
    expiryDate: '2027-01-15T10:00:00Z',
    blockchainHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'verified',
    metadata: {
      courseCode: 'CS161',
      credits: 4,
      grade: 'A',
      instructor: 'Dr. Sarah Johnson',
      courseDescription: 'Advanced study of data structures and algorithmic techniques',
      learningOutcomes: [
        'Implement complex data structures',
        'Analyze algorithm complexity',
        'Design efficient algorithms'
      ],
      skills: ['Algorithms', 'Data Structures', 'Problem Solving']
    },
    nftTokenId: '12345',
    nftContractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    verificationUrl: 'https://aetherbridge.com/verify/cred1',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aetherbridge.com/verify/cred1'
  },
  {
    id: 'cred2',
    userId: 'user1',
    type: 'assessment',
    title: 'Technical Skills Assessment',
    issuer: 'AetherBridge',
    issuerDid: 'did:ethr:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issueDate: '2024-03-10T14:30:00Z',
    expiryDate: '2025-03-10T14:30:00Z',
    blockchainHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    transactionHash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    status: 'verified',
    metadata: {
      assessmentType: 'technical',
      score: 85,
      maxScore: 100,
      duration: 45,
      skillsAssessed: ['JavaScript', 'Python', 'Data Structures'],
      passingScore: 70,
      assessmentDate: '2024-03-10T14:30:00Z'
    },
    nftTokenId: null,
    nftContractAddress: null,
    verificationUrl: 'https://aetherbridge.com/verify/cred2',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aetherbridge.com/verify/cred2'
  },
  {
    id: 'cred3',
    userId: 'user1',
    type: 'certification',
    title: 'Blockchain Development Certification',
    issuer: 'MIT',
    issuerDid: 'did:ethr:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issueDate: '2024-02-20T09:00:00Z',
    expiryDate: '2026-02-20T09:00:00Z',
    blockchainHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'verified',
    metadata: {
      certificationLevel: 'Advanced',
      duration: '6 months',
      modules: [
        'Smart Contract Development',
        'DeFi Protocols',
        'Blockchain Security'
      ],
      skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Blockchain Security'],
      instructor: 'Prof. Michael Chen'
    },
    nftTokenId: '67890',
    nftContractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    verificationUrl: 'https://aetherbridge.com/verify/cred3',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aetherbridge.com/verify/cred3'
  }
];

// Get credential by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const credential = mockPublicCredentials.find(cred => cred.id === req.params.id);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Return public credential data (without sensitive user information)
    const publicCredential = {
      id: credential.id,
      type: credential.type,
      title: credential.title,
      issuer: credential.issuer,
      issuerDid: credential.issuerDid,
      issueDate: credential.issueDate,
      expiryDate: credential.expiryDate,
      status: credential.status,
      metadata: credential.metadata,
      verificationUrl: credential.verificationUrl,
      qrCode: credential.qrCode,
      blockchainHash: credential.blockchainHash,
      transactionHash: credential.transactionHash,
      nftTokenId: credential.nftTokenId,
      nftContractAddress: credential.nftContractAddress
    };
    
    res.json({
      success: true,
      data: publicCredential
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credential',
      message: error.message
    });
  }
});

// Verify credential (public)
router.get('/:id/verify', async (req, res) => {
  try {
    const credential = mockPublicCredentials.find(cred => cred.id === req.params.id);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Verify blockchain hash (mock verification)
    const isBlockchainValid = credential.blockchainHash && credential.transactionHash;
    const isNotExpired = new Date(credential.expiryDate) > new Date();
    const isStatusValid = credential.status === 'verified';
    
    const verificationResult = {
      credentialId: credential.id,
      isValid: isBlockchainValid && isNotExpired && isStatusValid,
      blockchainProof: {
        hash: credential.blockchainHash,
        transactionHash: credential.transactionHash,
        blockNumber: 12345678,
        timestamp: new Date().toISOString(),
        explorerUrl: `https://etherscan.io/tx/${credential.transactionHash}`
      },
      verificationDetails: {
        blockchainValid: isBlockchainValid,
        notExpired: isNotExpired,
        statusValid: isStatusValid,
        verifiedAt: new Date().toISOString()
      },
      credential: {
        title: credential.title,
        issuer: credential.issuer,
        issueDate: credential.issueDate,
        expiryDate: credential.expiryDate,
        type: credential.type,
        status: credential.status
      },
      verificationUrl: credential.verificationUrl,
      qrCode: credential.qrCode
    };
    
    res.json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to verify credential',
      message: error.message
    });
  }
});

// Get credential metadata (public)
router.get('/:id/metadata', async (req, res) => {
  try {
    const credential = mockPublicCredentials.find(cred => cred.id === req.params.id);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    res.json({
      success: true,
      data: credential.metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credential metadata',
      message: error.message
    });
  }
});

// Search credentials by issuer
router.get('/search/issuer/:issuer', async (req, res) => {
  try {
    const { issuer } = req.params;
    const { type, status } = req.query;
    
    let filteredCredentials = mockPublicCredentials.filter(cred => 
      cred.issuer.toLowerCase().includes(issuer.toLowerCase())
    );
    
    if (type) {
      filteredCredentials = filteredCredentials.filter(cred => cred.type === type);
    }
    
    if (status) {
      filteredCredentials = filteredCredentials.filter(cred => cred.status === status);
    }
    
    // Return only public data
    const publicCredentials = filteredCredentials.map(cred => ({
      id: cred.id,
      type: cred.type,
      title: cred.title,
      issuer: cred.issuer,
      issueDate: cred.issueDate,
      status: cred.status,
      verificationUrl: cred.verificationUrl
    }));
    
    res.json({
      success: true,
      data: publicCredentials,
      total: publicCredentials.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search credentials',
      message: error.message
    });
  }
});

// Get credential statistics (public)
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: mockPublicCredentials.length,
      byType: {
        course: mockPublicCredentials.filter(cred => cred.type === 'course').length,
        assessment: mockPublicCredentials.filter(cred => cred.type === 'assessment').length,
        certification: mockPublicCredentials.filter(cred => cred.type === 'certification').length
      },
      byStatus: {
        verified: mockPublicCredentials.filter(cred => cred.status === 'verified').length,
        pending: mockPublicCredentials.filter(cred => cred.status === 'pending').length,
        revoked: mockPublicCredentials.filter(cred => cred.status === 'revoked').length
      },
      byIssuer: mockPublicCredentials.reduce((acc, cred) => {
        acc[cred.issuer] = (acc[cred.issuer] || 0) + 1;
        return acc;
      }, {}),
      nftCount: mockPublicCredentials.filter(cred => cred.nftTokenId).length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Get verification QR code
router.get('/:id/qr', async (req, res) => {
  try {
    const credential = mockPublicCredentials.find(cred => cred.id === req.params.id);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        qrCode: credential.qrCode,
        verificationUrl: credential.verificationUrl,
        credentialId: credential.id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code',
      message: error.message
    });
  }
});

module.exports = router; 