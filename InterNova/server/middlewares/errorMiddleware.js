/**
 * Global Error Handler Middleware
 * Provides consistent error responses across the API
 */
module.exports = (err, req, res, next) => {
  // Log error details for debugging
  console.error('❌ Error:', {
    message: err.message,
    status: err.status,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  const status = err.status || err.statusCode || 500;
  
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error',
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
