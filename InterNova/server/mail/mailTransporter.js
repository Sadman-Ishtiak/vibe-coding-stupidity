const nodemailer = require('nodemailer');

/**
 * Google SMTP Email Transporter
 * Centralized configuration for all email sending
 * Uses environment variables for credentials
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER || process.env.SMTP_EMAIL,
    // Remove any accidental spaces from app passwords
    pass: (process.env.EMAIL_PASS || process.env.SMTP_PASSWORD || '').toString().replace(/\s+/g, '')
  }
});

/**
 * Verify transporter configuration on startup
 */
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter configuration error:', error.message);
  } else {
    console.log('✅ Email service ready (Google SMTP)');
  }
});

module.exports = transporter;
