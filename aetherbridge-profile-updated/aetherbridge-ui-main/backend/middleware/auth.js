const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// Initialize Firebase Admin if not already initialized
// Temporarily disabled for development
/*
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
*/

/**
 * Middleware to authenticate tokens (simplified for development)
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token',
      });
    }

    // For development, accept any token and create mock user
    // In production, this should verify the actual token
    req.user = {
      uid: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User',
      role: 'student',
      did: 'did:example:123',
      walletAddress: '0x1234567890123456789012345678901234567890',
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid authentication token',
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required to access this resource',
    });
  }

  next();
};

/**
 * Middleware to check if user has institution role
 */
const requireInstitution = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource',
    });
  }

  if (req.user.role !== 'institution' && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Institution privileges required to access this resource',
    });
  }

  next();
};

/**
 * Middleware to check if user has student role
 */
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource',
    });
  }

  if (req.user.role !== 'student' && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Student privileges required to access this resource',
    });
  }

  next();
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token is provided, but adds user info if valid token exists
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        role: decodedToken.role || 'student',
        did: decodedToken.did,
        walletAddress: decodedToken.wallet_address,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }

  next();
};

/**
 * Generate JWT token for internal use
 */
const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

/**
 * Verify JWT token for internal use
 */
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
};

/**
 * Rate limiting middleware for authentication endpoints
 */
const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later or contact support if you need immediate assistance.',
  },
  standardHeaders: true,
  legacyHeaders: false,
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireInstitution,
  requireStudent,
  optionalAuth,
  generateJWT,
  verifyJWT,
  authRateLimit,
}; 