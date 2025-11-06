import AppError from '../utils/appError.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error 💥:', err);

  const statusCode = (err instanceof AppError && err.statusCode) || 500;
  const message = (err instanceof AppError && err.message) || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};
