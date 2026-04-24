const jwt = require('jsonwebtoken');

/**
 * Generate access token (configurable via JWT_ACCESS_EXPIRES env, default: 7d)
 * @param {string} id - User ID
 * @param {string} role - User role (candidate/company/recruiter)
 * @param {string} userType - User type (candidate/company) - optional, inferred from role
 * @returns {string} JWT access token
 */
const generateAccessToken = (id, role, userType = null) => {
  // Infer userType from role if not provided
  const type = userType || (role === 'candidate' ? 'candidate' : 'company');
  
  return jwt.sign(
    { id, role, userType: type },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' }
  );
};

/**
 * Generate long-lived refresh token (configurable via JWT_REFRESH_EXPIRES env, default: 7d)
 * @param {string} id - User ID
 * @param {string} role - User role (candidate/company/recruiter)
 * @param {string} userType - User type (candidate/company) - optional, inferred from role
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (id, role, userType = null) => {
  // Infer userType from role if not provided
  const type = userType || (role === 'candidate' ? 'candidate' : 'company');
  
  return jwt.sign(
    { id, role, userType: type },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

/**
 * Calculate refresh token expiry date
 * @param {number} days - Number of days until expiry (default: 7)
 * @returns {Date} Expiry date
 */
const getRefreshTokenExpiry = (days = 7) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
};
