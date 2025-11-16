import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided. You are not logged in.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+role');
    if (!user) {
      return next(new AppError('The user belonging to this token does no longer exist.', 404));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};

export const optionalAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('+role');
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore invalid or expired tokens.
    }
  }
  next();
};

/**
 * @description Protect routes and make them accessible only to admins.
 * @summary Assumes `verifyAccessToken` has run before it.
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('You do not have permission to perform this action.', 403));
};
