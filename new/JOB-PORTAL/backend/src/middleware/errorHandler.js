const { ApiError } = require('../utils/apiError');

function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Server Error',
    details: err instanceof ApiError ? err.details : undefined,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

module.exports = { errorHandler };
