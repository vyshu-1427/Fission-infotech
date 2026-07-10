import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes by verifying JWT token in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // Read header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Token verification failed: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid',
    });
  }
};

/**
 * Role-Based Access Control middleware
 * @param {...string} roles - Permitted roles (e.g. 'admin', 'customer')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'none'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
