const multer = require("multer");
const path = require("path");
const fs = require('fs');

/**
 * Ensure upload directories exist
 */
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Ensure all upload directories exist
['uploads/profile-pics', 'uploads/logos', 'uploads/gallery', 'uploads/resumes'].forEach(ensureDirectoryExists);

/**
 * Storage configuration for different file types
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/profile-pics'; // Default
    
    switch (file.fieldname) {
      case 'resume':
        uploadPath = 'uploads/resumes';
        break;
      case 'logo':
      case 'companyLogo':
        uploadPath = 'uploads/logos';
        break;
      case 'gallery':
      case 'galleryImages':
        uploadPath = 'uploads/gallery';
        break;
      case 'profilePicture':
      case 'profileImage':
      case 'avatar':
        uploadPath = 'uploads/profile-pics';
        break;
      default:
        uploadPath = 'uploads/profile-pics';
    }
    
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter for validating uploads
 */
const fileFilter = (req, file, cb) => {
  // PDF and DOC files for resumes
  if (file.fieldname === 'resume') {
    const allowedTypes = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.test(ext) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes'), false);
    }
    return;
  }
  
  // Images for all other fields
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedImageTypes.test(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WEBP) are allowed'), false);
  }
};

/**
 * Multer configuration with file size limits
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
