import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

export const optionalAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore invalid or expired tokens
    }
  }
  next();
};
