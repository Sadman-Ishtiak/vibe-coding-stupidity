/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */

const rateLimitStore = new Map();

/**
 * Rate limiter middleware
 * @param {number} maxRequests - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware
 */
const rateLimit = (maxRequests = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    // Use IP address as identifier
    const identifier = req.ip || req.connection.remoteAddress;
    
    const now = Date.now();
    const key = `${identifier}:${req.path}`;
    
    // Get or initialize record
    let record = rateLimitStore.get(key);
    
    if (!record) {
      record = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, record);
    }
    
    // Reset if window has passed
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    // Check limit
    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter,
      });
    }
    
    // Increment count
    record.count++;
    
    next();
  };
};

/**
 * Cleanup old entries periodically
 * Run this on a timer to prevent memory leaks
 */
const cleanupRateLimitStore = () => {
  const now = Date.now();
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Run cleanup every 10 minutes
setInterval(cleanupRateLimitStore, 10 * 60 * 1000);

module.exports = {
  rateLimit,
  cleanupRateLimitStore,
};
