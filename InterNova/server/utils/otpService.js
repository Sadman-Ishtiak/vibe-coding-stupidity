const crypto = require('crypto');
const { sendMail } = require('../mail/mailSender');
const { otpEmailTemplate } = require('../mail/mailTemplates');

/**
 * OTP Service - Email OTP Verification
 * 
 * Security Features:
 * - 6-digit OTP
 * - 10-minute expiry
 * - Hashed before storage
 * - Max verify attempts: 5
 * - Max resend attempts: 3/hour
 * - Purpose-based validation (signup/reset)
 */

/**
 * Generate 6-digit OTP
 * @returns {string} - Plain text OTP (not hashed)
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Hash OTP for secure database storage
 * @param {string} otp - Plain text OTP
 * @returns {string} - SHA256 hashed OTP
 */
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp.toString()).digest('hex');
};

/**
 * Verify OTP
 * @param {string} inputOTP - User-provided OTP
 * @param {string} storedHashedOTP - Hashed OTP from database
 * @returns {boolean}
 */
const verifyOTP = (inputOTP, storedHashedOTP) => {
  const hashedInput = hashOTP(inputOTP);
  return hashedInput === storedHashedOTP;
};

/**
 * Check if OTP is expired
 * @param {Date} expiryDate - OTP expiry timestamp
 * @returns {boolean}
 */
const isOTPExpired = (expiryDate) => {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
};

/**
 * Get OTP expiry time (10 minutes from now)
 * @returns {Date}
 */
const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Check if user exceeded verify attempts
 * @param {number} attempts - Current attempt count
 * @returns {boolean}
 */
const isMaxVerifyAttemptsExceeded = (attempts) => {
  const MAX_VERIFY_ATTEMPTS = 5;
  return attempts >= MAX_VERIFY_ATTEMPTS;
};

/**
 * Check if user can resend OTP
 * @param {number} resendCount - Current resend count
 * @param {Date} resetAt - When the counter will reset
 * @returns {object} { canResend: boolean, message: string }
 */
const canResendOTP = (resendCount, resetAt) => {
  const MAX_RESEND_PER_HOUR = 3;
  
  // Check if reset time has passed
  if (resetAt && new Date() > new Date(resetAt)) {
    return { canResend: true, message: 'OTP can be resent' };
  }
  
  if (resendCount >= MAX_RESEND_PER_HOUR) {
    const remainingTime = resetAt 
      ? Math.ceil((new Date(resetAt) - new Date()) / 60000) 
      : 0;
    return { 
      canResend: false, 
      message: `Too many OTP requests. Please wait ${remainingTime} minutes.` 
    };
  }
  
  return { canResend: true, message: 'OTP can be resent' };
};

/**
 * Get resend reset timestamp (1 hour from now)
 * @returns {Date}
 */
const getResendResetTime = () => {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - Plain text OTP
 * @param {string} purpose - 'signup' or 'reset'
 * @returns {Promise<boolean>}
 */
const sendOTPEmail = async (email, otp, purpose = 'signup') => {
  try {
    const { subject, html } = otpEmailTemplate(otp, purpose);
    
    const success = await sendMail({
      to: email,
      subject,
      html
    });

    if (success) {
      console.log(`✅ OTP email sent to ${email} (${purpose})`);
    }

    return success;
  } catch (error) {
    console.error('OTP Email send error:', error);
    return false;
  }
};

/**
 * Clear OTP data from user object
 * @param {object} user - Mongoose user document
 */
const clearOTPData = (user) => {
  user.emailOTP = null;
  user.emailOTPExpires = null;
  user.emailOTPPurpose = null;
  user.otpVerifyAttempts = 0;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  getOTPExpiry,
  isMaxVerifyAttemptsExceeded,
  canResendOTP,
  getResendResetTime,
  sendOTPEmail,
  clearOTPData,
};
