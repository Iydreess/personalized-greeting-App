const jwt = require('jsonwebtoken');
const db = require('../../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is blacklisted
    const [blacklistedTokens] = await db.execute(
      'SELECT id FROM session_tokens WHERE token_hash = ? AND (is_blacklisted = 1 OR expires_at < NOW())',
      [token]
    );

    if (blacklistedTokens.length > 0) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked or expired.'
      });
    }

    // Get user details
    const [users] = await db.execute(
      'SELECT id, first_name, last_name, email, phone, role, is_active FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive.'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize('admin');

// Staff and admin middleware
const staffOnly = authorize('staff', 'admin');

module.exports = {
  authMiddleware,
  authorize,
  adminOnly,
  staffOnly
};
