import AppError from '../utils/appError.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error 💥:', err);

  let error = { ...err };
  error.message = err.message;

  // JSON Syntax Error from body-parser
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new AppError('Invalid JSON payload', 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(
      err.keyValue
    )}`;
    error = new AppError(message, 400);
  }

  const statusCode = (error instanceof AppError && error.statusCode) || 500;
  const message = (error instanceof AppError && error.message) || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};
