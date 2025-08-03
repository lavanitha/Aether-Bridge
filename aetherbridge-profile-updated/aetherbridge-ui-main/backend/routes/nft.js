const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// Mock NFT data for development
const mockNFTs = [
  {
    id: 'nft1',
    tokenId: '12345',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    credentialId: 'cred1',
    userId: 'user1',
    title: 'Advanced Data Structures and Algorithms',
    description: 'NFT representation of Advanced Data Structures and Algorithms credential from Stanford University',
    image: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://aetherbridge.com/verify/cred1',
    metadata: {
      name: 'Advanced Data Structures and Algorithms',
      description: 'NFT representation of Advanced Data Structures and Algorithms credential from Stanford University',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://aetherbridge.com/verify/cred1',
      attributes: [
        { trait_type: 'Issuer', value: 'Stanford University' },
        { trait_type: 'Type', value: 'course' },
        { trait_type: 'Issue Date', value: '2024-01-15T10:00:00Z' },
        { trait_type: 'Status', value: 'verified' },
        { trait_type: 'Credits', value: '4' },
        { trait_type: 'Grade', value: 'A' }
      ],
      external_url: 'https://aetherbridge.com/verify/cred1',
      animation_url: 'https://aetherbridge.com/verify/cred1'
    },
    mintedAt: '2024-03-01T12:00:00Z',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    network: 'ethereum',
    status: 'minted',
    marketplaceLinks: {
      opensea: 'https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6/12345',
      rarible: 'https://rarible.com/token/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6:12345'
    }
  },
  {
    id: 'nft2',
    tokenId: '67890',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    credentialId: 'cred3',
    userId: 'user1',
    title: 'Blockchain Development Certification',
    description: 'NFT representation of Blockchain Development Certification from MIT',
    image: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://aetherbridge.com/verify/cred3',
    metadata: {
      name: 'Blockchain Development Certification',
      description: 'NFT representation of Blockchain Development Certification from MIT',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://aetherbridge.com/verify/cred3',
      attributes: [
        { trait_type: 'Issuer', value: 'MIT' },
        { trait_type: 'Type', value: 'certification' },
        { trait_type: 'Issue Date', value: '2024-02-20T09:00:00Z' },
        { trait_type: 'Status', value: 'verified' },
        { trait_type: 'Level', value: 'Advanced' },
        { trait_type: 'Duration', value: '6 months' }
      ],
      external_url: 'https://aetherbridge.com/verify/cred3',
      animation_url: 'https://aetherbridge.com/verify/cred3'
    },
    mintedAt: '2024-03-05T15:30:00Z',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    network: 'ethereum',
    status: 'minted',
    marketplaceLinks: {
      opensea: 'https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6/67890',
      rarible: 'https://rarible.com/token/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6:67890'
    }
  }
];

// Get user's NFTs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, network } = req.query;
    
    let filteredNFTs = mockNFTs.filter(nft => nft.userId === userId);
    
    if (status) {
      filteredNFTs = filteredNFTs.filter(nft => nft.status === status);
    }
    
    if (network) {
      filteredNFTs = filteredNFTs.filter(nft => nft.network === network);
    }
    
    // Sort by minted date (newest first)
    filteredNFTs.sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt));
    
    res.json({
      success: true,
      data: filteredNFTs,
      total: filteredNFTs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NFTs',
      message: error.message
    });
  }
});

// Get NFT by ID
router.get('/:id', async (req, res) => {
  try {
    const nft = mockNFTs.find(n => n.id === req.params.id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NFT',
      message: error.message
    });
  }
});

// Mint NFT from credential
router.post('/mint', authenticateToken, async (req, res) => {
  try {
    const { credentialId, network = 'ethereum' } = req.body;
    const userId = req.user.id;
    
    // Check if credential exists and belongs to user
    const credential = require('./credentials').mockCredentials.find(
      cred => cred.id === credentialId && cred.userId === userId
    );
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    if (credential.status !== 'verified') {
      return res.status(400).json({
        success: false,
        error: 'Only verified credentials can be minted as NFTs'
      });
    }
    
    if (credential.nftTokenId) {
      return res.status(400).json({
        success: false,
        error: 'Credential already minted as NFT'
      });
    }
    
    // Generate NFT data
    const tokenId = Math.floor(Math.random() * 100000).toString();
    const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    const transactionHash = '0x' + crypto.randomBytes(32).toString('hex');
    
    const nftData = {
      id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenId,
      contractAddress,
      credentialId,
      userId,
      title: credential.title,
      description: `NFT representation of ${credential.title} credential from ${credential.issuer}`,
      image: credential.qrCode,
      metadata: {
        name: credential.title,
        description: `NFT representation of ${credential.title} credential from ${credential.issuer}`,
        image: credential.qrCode,
        attributes: [
          { trait_type: 'Issuer', value: credential.issuer },
          { trait_type: 'Type', value: credential.type },
          { trait_type: 'Issue Date', value: credential.issueDate },
          { trait_type: 'Status', value: credential.status },
          ...(credential.metadata.skills ? [{ trait_type: 'Skills', value: credential.metadata.skills.join(', ') }] : [])
        ],
        external_url: credential.verificationUrl,
        animation_url: credential.verificationUrl
      },
      mintedAt: new Date().toISOString(),
      transactionHash,
      network,
      status: 'minted',
      marketplaceLinks: {
        opensea: `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`,
        rarible: `https://rarible.com/token/${contractAddress}:${tokenId}`
      }
    };
    
    // Add NFT to mock data
    mockNFTs.push(nftData);
    
    // Update credential with NFT info
    credential.nftTokenId = tokenId;
    credential.nftContractAddress = contractAddress;
    
    res.json({
      success: true,
      data: nftData,
      message: 'NFT minted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to mint NFT',
      message: error.message
    });
  }
});

// Transfer NFT
router.post('/:id/transfer', authenticateToken, async (req, res) => {
  try {
    const { toAddress } = req.body;
    const nftId = req.params.id;
    const userId = req.user.id;
    
    const nft = mockNFTs.find(n => n.id === nftId && n.userId === userId);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    // Mock transfer process
    const transferData = {
      id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nftId,
      fromAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Mock user address
      toAddress,
      transactionHash: '0x' + crypto.randomBytes(32).toString('hex'),
      transferredAt: new Date().toISOString(),
      status: 'completed'
    };
    
    // Update NFT ownership
    nft.userId = 'transferred'; // In real implementation, this would be the new owner's ID
    nft.transferHistory = nft.transferHistory || [];
    nft.transferHistory.push(transferData);
    
    res.json({
      success: true,
      data: transferData,
      message: 'NFT transferred successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to transfer NFT',
      message: error.message
    });
  }
});

// List NFT for sale
router.post('/:id/list', authenticateToken, async (req, res) => {
  try {
    const { price, currency = 'ETH', marketplace = 'opensea' } = req.body;
    const nftId = req.params.id;
    const userId = req.user.id;
    
    const nft = mockNFTs.find(n => n.id === nftId && n.userId === userId);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    const listingData = {
      id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nftId,
      userId,
      price: parseFloat(price),
      currency,
      marketplace,
      listedAt: new Date().toISOString(),
      status: 'active',
      marketplaceUrl: `${nft.marketplaceLinks[marketplace]}?price=${price}${currency}`
    };
    
    res.json({
      success: true,
      data: listingData,
      message: 'NFT listed for sale successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list NFT',
      message: error.message
    });
  }
});

// Get NFT metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const nft = mockNFTs.find(n => n.id === req.params.id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.json({
      success: true,
      data: nft.metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NFT metadata',
      message: error.message
    });
  }
});

// Get NFT statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userNFTs = mockNFTs.filter(nft => nft.userId === userId);
    
    const stats = {
      total: userNFTs.length,
      byNetwork: userNFTs.reduce((acc, nft) => {
        acc[nft.network] = (acc[nft.network] || 0) + 1;
        return acc;
      }, {}),
      byStatus: userNFTs.reduce((acc, nft) => {
        acc[nft.status] = (acc[nft.status] || 0) + 1;
        return acc;
      }, {}),
      totalValue: userNFTs.length * 0.1, // Mock value calculation
      averageValue: userNFTs.length > 0 ? 0.1 : 0
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NFT statistics',
      message: error.message
    });
  }
});

// Get supported marketplaces
router.get('/marketplaces', async (req, res) => {
  try {
    const marketplaces = [
      {
        id: 'opensea',
        name: 'OpenSea',
        url: 'https://opensea.io',
        description: 'The world\'s largest NFT marketplace',
        supportedNetworks: ['ethereum', 'polygon', 'arbitrum'],
        fees: {
          platform: 2.5,
          creator: 10
        }
      },
      {
        id: 'rarible',
        name: 'Rarible',
        url: 'https://rarible.com',
        description: 'Community-owned NFT marketplace',
        supportedNetworks: ['ethereum', 'polygon', 'tezos'],
        fees: {
          platform: 2.5,
          creator: 10
        }
      },
      {
        id: 'foundation',
        name: 'Foundation',
        url: 'https://foundation.app',
        description: 'Curated NFT marketplace for digital art',
        supportedNetworks: ['ethereum'],
        fees: {
          platform: 5,
          creator: 10
        }
      }
    ];
    
    res.json({
      success: true,
      data: marketplaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch marketplaces',
      message: error.message
    });
  }
});

module.exports = router; 