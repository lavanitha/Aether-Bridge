const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { ethers } = require('ethers');

// Mock wallet data for development
const mockWallets = [
  {
    userId: 'user1',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    did: 'did:ethr:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    network: 'ethereum',
    balance: '0.5',
    connectedAt: '2024-03-01T10:00:00Z',
    isActive: true
  }
];

// Connect wallet
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    const userId = req.user.id;
    
    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }
    
    // Verify signature (simplified for development)
    if (signature && message) {
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(400).json({
            success: false,
            error: 'Invalid signature'
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Signature verification failed'
        });
      }
    }
    
    // Check if wallet is already connected
    const existingWallet = mockWallets.find(w => w.userId === userId);
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        error: 'Wallet already connected'
      });
    }
    
    // Create DID
    const did = `did:ethr:${walletAddress}`;
    
    // Get wallet balance (mock)
    const balance = (Math.random() * 2).toFixed(4);
    
    const walletData = {
      userId,
      walletAddress,
      did,
      network: 'ethereum',
      balance,
      connectedAt: new Date().toISOString(),
      isActive: true
    };
    
    mockWallets.push(walletData);
    
    res.json({
      success: true,
      data: {
        walletAddress,
        did,
        balance,
        network: 'ethereum'
      },
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to connect wallet',
      message: error.message
    });
  }
});

// Get wallet info
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wallet = mockWallets.find(w => w.userId === userId && w.isActive);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
    
    // Update balance (mock)
    wallet.balance = (Math.random() * 2).toFixed(4);
    
    res.json({
      success: true,
      data: {
        walletAddress: wallet.walletAddress,
        did: wallet.did,
        balance: wallet.balance,
        network: wallet.network,
        connectedAt: wallet.connectedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet info',
      message: error.message
    });
  }
});

// Disconnect wallet
router.delete('/disconnect', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const walletIndex = mockWallets.findIndex(w => w.userId === userId && w.isActive);
    
    if (walletIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
    
    mockWallets[walletIndex].isActive = false;
    mockWallets[walletIndex].disconnectedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Wallet disconnected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect wallet',
      message: error.message
    });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;
    
    const wallet = mockWallets.find(w => w.userId === userId && w.isActive);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
    
    // Mock transaction history
    const mockTransactions = [
      {
        id: 'tx1',
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: wallet.walletAddress,
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '0.1',
        gasUsed: '21000',
        gasPrice: '20000000000',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        blockNumber: 12345678,
        type: 'transfer'
      },
      {
        id: 'tx2',
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: wallet.walletAddress,
        value: '0.05',
        gasUsed: '21000',
        gasPrice: '20000000000',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        blockNumber: 12345677,
        type: 'transfer'
      },
      {
        id: 'tx3',
        hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        from: wallet.walletAddress,
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '0',
        gasUsed: '150000',
        gasPrice: '20000000000',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        blockNumber: 12345676,
        type: 'contract_interaction',
        contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        method: 'mintNFT'
      }
    ];
    
    const paginatedTransactions = mockTransactions.slice(offset, offset + limit);
    
    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total: mockTransactions.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + limit < mockTransactions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

// Get wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wallet = mockWallets.find(w => w.userId === userId && w.isActive);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
    
    // Update balance (mock)
    wallet.balance = (Math.random() * 2).toFixed(4);
    
    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: 'ETH',
        network: wallet.network,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get balance',
      message: error.message
    });
  }
});

// Get DID document
router.get('/did', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wallet = mockWallets.find(w => w.userId === userId && w.isActive);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
    
    const didDocument = {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: wallet.did,
      verificationMethod: [
        {
          id: `${wallet.did}#controller`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: wallet.did,
          publicKeyHex: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
        }
      ],
      authentication: [`${wallet.did}#controller`],
      assertionMethod: [`${wallet.did}#controller`],
      service: [
        {
          id: `${wallet.did}#linked-domain`,
          type: 'LinkedDomains',
          serviceEndpoint: 'https://aetherbridge.com'
        }
      ]
    };
    
    res.json({
      success: true,
      data: didDocument
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get DID document',
      message: error.message
    });
  }
});

// Sign message
router.post('/sign', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    const wallet = mockWallets.find(w => w.userId === userId && w.isActive);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
    
    // In a real implementation, this would use the actual wallet to sign
    // For development, we'll return a mock signature
    const mockSignature = '0x' + 'a'.repeat(130);
    
    res.json({
      success: true,
      data: {
        message,
        signature: mockSignature,
        signer: wallet.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to sign message',
      message: error.message
    });
  }
});

// Get supported networks
router.get('/networks', async (req, res) => {
  try {
    const networks = [
      {
        id: 'ethereum',
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
        explorer: 'https://etherscan.io',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      },
      {
        id: 'polygon',
        name: 'Polygon',
        chainId: 137,
        rpcUrl: 'https://polygon-rpc.com',
        explorer: 'https://polygonscan.com',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        }
      },
      {
        id: 'arbitrum',
        name: 'Arbitrum One',
        chainId: 42161,
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        explorer: 'https://arbiscan.io',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      }
    ];
    
    res.json({
      success: true,
      data: networks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch networks',
      message: error.message
    });
  }
});

module.exports = router; 