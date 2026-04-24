const crypto = require('crypto');
const { sendMail } = require('../mail/mailSender');
const { passwordResetEmailTemplate, applicationStatusEmailTemplate } = require('../mail/mailTemplates');

/**
 * Email utility for sending password reset and application status emails
 */

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Plain text reset token (not hashed)
 * @returns {Promise<boolean>}
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const { subject, html } = passwordResetEmailTemplate(resetToken);
    
    const success = await sendMail({
      to: email,
      subject,
      html
    });

    if (success) {
      console.log(`✅ Password reset email sent to ${email}`);
    }

    return success;
  } catch (error) {
    console.error('Password reset email send error:', error);
    return false;
  }
};

/**
 * Generate secure reset token
 * @returns {string} - 32-byte hex token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash reset token for database storage
 * @param {string} token - Plain text token
 * @returns {string} - SHA256 hashed token
 */
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Send application status notification email
 * @param {string} email - Recipient email address
 * @param {string} candidateName - Candidate's full name
 * @param {string} jobTitle - Job title
 * @param {string} companyName - Company name
 * @param {string} status - Application status ('accepted' or 'rejected')
 * @returns {Promise<boolean>}
 */
const sendApplicationStatusEmail = async (email, candidateName, jobTitle, companyName, status) => {
  try {
    const { subject, html } = applicationStatusEmailTemplate(candidateName, jobTitle, companyName, status);
    
    const success = await sendMail({
      to: email,
      subject,
      html
    });

    if (success) {
      console.log(`✅ Application ${status} email sent to ${email}`);
    }

    return success;
  } catch (error) {
    console.error('Application status email send error:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  generateResetToken,
  hashResetToken,
  sendApplicationStatusEmail,
};
