/**
 * Email Templates
 * Reusable HTML templates for all email types
 */

/**
 * OTP verification email template
 * @param {string} otp - 6-digit OTP code
 * @param {string} purpose - 'signup' or 'reset'
 * @returns {object} { subject, html }
 */
const otpEmailTemplate = (otp, purpose = 'signup') => {
  const subject = purpose === 'signup' 
    ? 'Email Verification OTP - InternNova'
    : 'Password Reset OTP - InternNova';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a73e8; margin: 0;">InternNova</h1>
      </div>
      
      <h2 style="color: #333;">${purpose === 'signup' ? 'Email Verification' : 'Password Reset'}</h2>
      
      <p style="color: #555; font-size: 16px;">Your OTP code is:</p>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; border-radius: 10px; margin: 25px 0;">
        <div style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 10px; font-family: 'Courier New', monospace;">
          ${otp}
        </div>
      </div>
      
      <p style="color: #555; font-size: 14px;"><strong>⏰ This code will expire in 10 minutes.</strong></p>
      
      <p style="color: #777; font-size: 14px; margin-top: 20px;">
        If you didn't request this ${purpose === 'signup' ? 'verification' : 'password reset'}, please ignore this email.
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email. Please do not reply.<br>
        © 2026 InternNova - Your Gateway to Internships
      </p>
    </div>
  `;

  return { subject, html };
};

/**
 * Password reset email template
 * @param {string} resetToken - Password reset token
 * @returns {object} { subject, html }
 */
const passwordResetEmailTemplate = (resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  
  const subject = 'Password Reset Request - InternNova';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a73e8; margin: 0;">InternNova</h1>
      </div>
      
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #555; font-size: 16px;">You requested to reset your password for InternNova.</p>
      <p style="color: #555; font-size: 16px;">Click the button below to reset your password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #555; font-size: 14px;">Or copy and paste this URL into your browser:</p>
      <p style="color: #1a73e8; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">${resetUrl}</p>
      
      <p style="color: #d32f2f; font-size: 14px;"><strong>⏰ This link will expire in 30 minutes.</strong></p>
      
      <p style="color: #777; font-size: 14px; margin-top: 20px;">
        If you didn't request this, please ignore this email.
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email. Please do not reply.<br>
        © 2026 InternNova - Your Gateway to Internships
      </p>
    </div>
  `;

  return { subject, html };
};

/**
 * Application status email template
 * @param {string} candidateName - Candidate's full name
 * @param {string} jobTitle - Job title
 * @param {string} companyName - Company name
 * @param {string} status - 'accepted' or 'rejected'
 * @returns {object} { subject, html }
 */
const applicationStatusEmailTemplate = (candidateName, jobTitle, companyName, status) => {
  const isAccepted = status === 'accepted';
  const subject = isAccepted 
    ? 'Congratulations! Your Application Has Been Accepted'
    : 'Application Status Update';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a73e8; margin: 0;">InternNova</h1>
      </div>
      
      <h2 style="color: #333;">Hello ${candidateName},</h2>
      
      ${isAccepted ? `
        <p style="color: #555; font-size: 16px;">
          We are pleased to inform you that your application for the position of 
          <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong style="color: #048565;">accepted</strong>!
        </p>
        <p style="color: #555; font-size: 16px;">
          Congratulations! The company will contact you soon regarding the next steps.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #048565 0%, #02b87c 100%); 
                      color: white; border-radius: 8px; font-weight: bold; font-size: 16px;">
            ✓ Application Accepted
          </div>
        </div>
      ` : `
        <p style="color: #555; font-size: 16px;">
          Thank you for your interest in the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
        </p>
        <p style="color: #555; font-size: 16px;">
          After careful consideration, we regret to inform you that your application has not been selected to move forward at this time.
        </p>
        <p style="color: #555; font-size: 16px;">
          We encourage you to continue exploring other opportunities on InternNova and wish you the best in your job search.
        </p>
      `}
      
      <p style="color: #555; font-size: 16px; margin-top: 30px;">
        You can view all your applications and their status by logging into your InternNova account.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/applied-jobs" 
           style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; 
                  color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
          View My Applications
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email. Please do not reply.<br>
        © 2026 InternNova - Your Gateway to Internships
      </p>
    </div>
  `;

  return { subject, html };
};

module.exports = {
  otpEmailTemplate,
  passwordResetEmailTemplate,
  applicationStatusEmailTemplate,
};
