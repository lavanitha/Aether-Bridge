const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// Mock credentials data for development
const mockCredentials = [
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

// Get user credentials
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, status, issuer } = req.query;
    
    let filteredCredentials = mockCredentials.filter(cred => cred.userId === userId);
    
    if (type) {
      filteredCredentials = filteredCredentials.filter(cred => cred.type === type);
    }
    
    if (status) {
      filteredCredentials = filteredCredentials.filter(cred => cred.status === status);
    }
    
    if (issuer) {
      filteredCredentials = filteredCredentials.filter(cred => 
        cred.issuer.toLowerCase().includes(issuer.toLowerCase())
      );
    }
    
    // Sort by issue date (newest first)
    filteredCredentials.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    
    res.json({
      success: true,
      data: filteredCredentials,
      total: filteredCredentials.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credentials',
      message: error.message
    });
  }
});

// Get credential by ID
router.get('/:id', async (req, res) => {
  try {
    const credential = mockCredentials.find(cred => cred.id === req.params.id);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    res.json({
      success: true,
      data: credential
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credential',
      message: error.message
    });
  }
});

// Verify credential
router.get('/:id/verify', async (req, res) => {
  try {
    const credential = mockCredentials.find(cred => cred.id === req.params.id);
    
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
        timestamp: new Date().toISOString()
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
        type: credential.type
      }
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

// Mint credential as NFT
router.post('/:id/mint-nft', authenticateToken, async (req, res) => {
  try {
    const credentialId = req.params.id;
    const userId = req.user.id;
    
    const credential = mockCredentials.find(cred => cred.id === credentialId && cred.userId === userId);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    if (credential.nftTokenId) {
      return res.status(400).json({
        success: false,
        error: 'Credential already minted as NFT'
      });
    }
    
    if (credential.status !== 'verified') {
      return res.status(400).json({
        success: false,
        error: 'Only verified credentials can be minted as NFTs'
      });
    }
    
    // Mock NFT minting process
    const tokenId = Math.floor(Math.random() * 100000).toString();
    const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    const transactionHash = '0x' + crypto.randomBytes(32).toString('hex');
    
    // Update credential with NFT info
    credential.nftTokenId = tokenId;
    credential.nftContractAddress = contractAddress;
    
    const nftData = {
      tokenId,
      contractAddress,
      transactionHash,
      blockchainLink: `https://etherscan.io/tx/${transactionHash}`,
      openseaLink: `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`,
      metadata: {
        name: credential.title,
        description: `NFT representation of ${credential.title} credential`,
        image: credential.qrCode,
        attributes: [
          { trait_type: 'Issuer', value: credential.issuer },
          { trait_type: 'Type', value: credential.type },
          { trait_type: 'Issue Date', value: credential.issueDate },
          { trait_type: 'Status', value: credential.status }
        ]
      }
    };
    
    res.json({
      success: true,
      data: nftData,
      message: 'Credential successfully minted as NFT'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to mint NFT',
      message: error.message
    });
  }
});

// Download credential
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const credentialId = req.params.id;
    const userId = req.user.id;
    
    const credential = mockCredentials.find(cred => cred.id === credentialId && cred.userId === userId);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Generate credential PDF data (mock)
    const pdfData = {
      credentialId: credential.id,
      title: credential.title,
      issuer: credential.issuer,
      issueDate: credential.issueDate,
      expiryDate: credential.expiryDate,
      verificationUrl: credential.verificationUrl,
      qrCode: credential.qrCode,
      blockchainHash: credential.blockchainHash,
      metadata: credential.metadata
    };
    
    res.json({
      success: true,
      data: {
        downloadUrl: `https://aetherbridge.com/api/credentials/${credentialId}/pdf`,
        filename: `${credential.title.replace(/\s+/g, '_')}_${credential.id}.pdf`,
        size: '245KB',
        format: 'PDF'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate download',
      message: error.message
    });
  }
});

// Get credential statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userCredentials = mockCredentials.filter(cred => cred.userId === userId);
    
    const stats = {
      total: userCredentials.length,
      byType: {
        course: userCredentials.filter(cred => cred.type === 'course').length,
        assessment: userCredentials.filter(cred => cred.type === 'assessment').length,
        certification: userCredentials.filter(cred => cred.type === 'certification').length
      },
      byStatus: {
        verified: userCredentials.filter(cred => cred.status === 'verified').length,
        pending: userCredentials.filter(cred => cred.status === 'pending').length,
        revoked: userCredentials.filter(cred => cred.status === 'revoked').length
      },
      byIssuer: userCredentials.reduce((acc, cred) => {
        acc[cred.issuer] = (acc[cred.issuer] || 0) + 1;
        return acc;
      }, {}),
      nftCount: userCredentials.filter(cred => cred.nftTokenId).length,
      totalSkills: [...new Set(userCredentials.flatMap(cred => 
        cred.metadata.skills || []
      ))].length
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

// Share credential
router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const { email, message } = req.body;
    const credentialId = req.params.id;
    const userId = req.user.id;
    
    const credential = mockCredentials.find(cred => cred.id === credentialId && cred.userId === userId);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Mock sharing process
    const shareData = {
      id: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      credentialId,
      sharedBy: userId,
      sharedWith: email,
      message,
      shareUrl: `https://aetherbridge.com/verify/${credentialId}?shared=true`,
      sharedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
    
    res.json({
      success: true,
      data: shareData,
      message: 'Credential shared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to share credential',
      message: error.message
    });
  }
});

module.exports = router; 