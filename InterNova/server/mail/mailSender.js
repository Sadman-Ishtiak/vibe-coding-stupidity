const transporter = require('./mailTransporter');

/**
 * Generic email sender
 * Handles all email sending with consistent logging and error handling
 * 
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.from] - Sender address (optional, defaults to noreply@internnova.com)
 * @returns {Promise<boolean>} - Success status
 */
const sendMail = async ({ to, subject, html, from = '"InternNova" <noreply@internnova.com>' }) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n================================');
    console.log('📧 EMAIL SENT SUCCESSFULLY');
    console.log('================================');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message ID:', info.messageId);
    console.log('================================\n');

    return true;
  } catch (error) {
    console.error('\n================================');
    console.error('❌ EMAIL SEND FAILED');
    console.error('================================');
    console.error('To:', to);
    console.error('Subject:', subject);
    console.error('Error:', error.message);
    console.error('================================\n');
    
    return false;
  }
};

module.exports = {
  sendMail
};
