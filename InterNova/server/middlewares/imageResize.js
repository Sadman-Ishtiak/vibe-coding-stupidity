const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Image configuration per type
 * All images maintain aspect ratio with cover strategy (center crop)
 */
const IMAGE_CONFIG = {
  avatar: { width: 33, height: 33, quality: 90, format: 'jpeg' },
  profile: { width: 200, height: 200, quality: 85, format: 'jpeg' },
  logo: { width: 120, height: 120, quality: 85, format: 'jpeg' },
  gallery: { width: 800, height: 600, quality: 80, format: 'jpeg' },
};

/**
 * Delete file safely with error handling
 * @param {string} filePath - Path to file to delete
 * @returns {Promise<void>}
 */
async function deleteFile(filePath) {
  if (!filePath) return;
  
  try {
    await fs.unlink(filePath);
    console.log(`🗑️  Deleted: ${path.basename(filePath)}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`⚠️  Failed to delete ${filePath}:`, error.message);
    }
  }
}

/**
 * Delete old image from filesystem
 * @param {string} imageUrl - Image URL from database (e.g., /uploads/logos/123.jpg)
 */
async function deleteOldImage(imageUrl) {
  if (!imageUrl) return;
  
  try {
    // Convert URL to filesystem path
    const relativePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    const fullPath = path.join(process.cwd(), relativePath);
    
    await deleteFile(fullPath);
  } catch (error) {
    console.error('Error deleting old image:', error.message);
  }
}

/**
 * Process and resize image using Sharp
 * @param {string} inputPath - Path to original uploaded image
 * @param {string} outputPath - Path where processed image will be saved
 * @param {Object} config - Image configuration (width, height, quality, format)
 * @returns {Promise<void>}
 */
async function processImage(inputPath, outputPath, config) {
  try {
    const { width, height, quality, format } = config;
    
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',           // Crop to fill dimensions
        position: 'center',      // Center crop
        withoutEnlargement: false  // Allow upscaling if needed
      })
      [format]({ quality, mozjpeg: true })  // Dynamic format method
      .toFile(outputPath);

    console.log(`✅ Image processed: ${path.basename(outputPath)} (${width}x${height})`);
  } catch (error) {
    console.error('❌ Image processing error:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

/**
 * Validate that file is a valid image
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>}
 */
async function validateImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return metadata.format && ['jpeg', 'png', 'gif', 'webp'].includes(metadata.format);
  } catch (error) {
    return false;
  }
}

/**
 * Process uploaded image with specified type
 * @param {Object} file - Multer file object
 * @param {string} imageType - Type of image: 'avatar', 'profile', 'logo', 'gallery'
 * @returns {Promise<string>} - Relative path to processed image
 */
async function processUploadedImage(file, imageType) {
  if (!file) {
    throw new Error('No file provided for processing');
  }

  if (!IMAGE_CONFIG[imageType]) {
    throw new Error(`Invalid image type: ${imageType}`);
  }

  const config = IMAGE_CONFIG[imageType];
  const originalPath = file.path;
  const originalDir = path.dirname(originalPath);
  const ext = `.${config.format}`;
  
  // Generate processed filename
  const processedFilename = `${Date.now()}-processed${ext}`;
  const processedPath = path.join(originalDir, processedFilename);

  try {
    // Validate image
    const isValid = await validateImage(originalPath);
    if (!isValid) {
      throw new Error('Invalid or corrupted image file');
    }

    // Process the image
    await processImage(originalPath, processedPath, config);

    // Delete original upload
    await deleteFile(originalPath);

    // Return relative path for database storage
    const folderName = path.basename(originalDir);
    const relativePath = `/uploads/${folderName}/${processedFilename}`;
    console.log(`📸 Image ready: ${relativePath}`);
    
    return relativePath;
  } catch (error) {
    // Cleanup both files on error
    await deleteFile(originalPath);
    await deleteFile(processedPath);
    
    throw error;
  }
}

/**
 * Middleware factory to process images after Multer upload
 * @param {string} imageType - Type of image to process
 * @param {string} fieldName - Name of the field in req.files or req.file
 * @returns {Function} Express middleware
 * 
 * @example
 * // Single file upload
 * router.post('/upload', upload.single('profilePicture'), 
 *   processImageMiddleware('profile', 'profilePicture'), 
 *   controller
 * );
 * 
 * @example
 * // Multiple files upload
 * router.post('/upload', upload.fields([
 *   { name: 'logo', maxCount: 1 },
 *   { name: 'gallery', maxCount: 3 }
 * ]), 
 *   processImageMiddleware('logo', 'logo'),
 *   processImageMiddleware('gallery', 'gallery'),
 *   controller
 * );
 */
function processImageMiddleware(imageType, fieldName) {
  return async (req, res, next) => {
    try {
      // Handle single file upload
      if (req.file && req.file.fieldname === fieldName) {
        console.log(`🔄 Processing ${imageType}: ${req.file.filename}`);
        
        const processedPath = await processUploadedImage(req.file, imageType);
        req.file.processedPath = processedPath;
        req.file.filename = path.basename(processedPath);
        
        console.log(`✅ ${imageType} processed successfully`);
      }
      
      // Handle multiple files upload
      if (req.files && req.files[fieldName]) {
        const files = Array.isArray(req.files[fieldName]) 
          ? req.files[fieldName] 
          : [req.files[fieldName]];
        
        console.log(`🔄 Processing ${files.length} ${imageType}(s)`);
        
        req.processedPaths = req.processedPaths || {};
        req.processedPaths[fieldName] = [];
        
        for (const file of files) {
          const processedPath = await processUploadedImage(file, imageType);
          req.processedPaths[fieldName].push(processedPath);
          // Also set processedPath on the file object itself for easier access
          file.processedPath = processedPath;
          file.filename = path.basename(processedPath);
        }
        
        console.log(`✅ ${files.length} ${imageType}(s) processed successfully`);
      }
      
      next();
    } catch (error) {
      console.error(`❌ ${imageType} processing error:`, error);
      
      // Cleanup uploaded files on error
      if (req.file && req.file.path) {
        await deleteFile(req.file.path);
      }
      if (req.files && req.files[fieldName]) {
        const files = Array.isArray(req.files[fieldName]) 
          ? req.files[fieldName] 
          : [req.files[fieldName]];
        for (const file of files) {
          await deleteFile(file.path);
        }
      }
      
      return res.status(500).json({
        success: false,
        message: `Failed to process ${imageType}`,
        error: error.message,
      });
    }
  };
}

module.exports = {
  processImageMiddleware,
  processUploadedImage,
  deleteOldImage,
  deleteFile,
  validateImage,
  IMAGE_CONFIG,
};
