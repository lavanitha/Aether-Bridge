const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');
const courseRoutes = require('./routes/courses');
const equivalencyRoutes = require('./routes/equivalency');
const mentorshipRoutes = require('./routes/mentorship');
const eventsRoutes = require('./routes/events');
const assessmentRoutes = require('./routes/assessment');
const walletRoutes = require('./routes/wallet');
const credentialsRoutes = require('./routes/credentials');
const nftRoutes = require('./routes/nft');
const adminRoutes = require('./routes/admin');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Import services
const { initializeDatabase } = require('./services/database');
const { initializeBlockchain } = require('./services/blockchain');
const { initializeAI } = require('./services/ai');
const { initializeEmail } = require('./services/email');

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or any localhost port during development
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // You can restrict specific origins in production
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/equivalency', authenticateToken, equivalencyRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/assessment', authenticateToken, assessmentRoutes);
app.use('/api/wallet', authenticateToken, walletRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/nft', authenticateToken, nftRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Public routes (no authentication required)
app.use('/api/public/credentials', require('./routes/public-credentials'));

// Blockchain status endpoint
app.get('/api/blockchain/status', async (req, res) => {
  try {
    const blockchainService = require('./services/blockchain');
    const status = await blockchainService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blockchain status' });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Initialize services and start server
async function startServer() {
  try {
    console.log('🚀 Starting AetherBridge Backend Server...');
    
    // Initialize services
    await initializeDatabase();
    await initializeBlockchain();
    await initializeAI();
    await initializeEmail();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app; 