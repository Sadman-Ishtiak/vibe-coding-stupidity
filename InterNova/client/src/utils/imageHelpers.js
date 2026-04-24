/**
 * Image URL Normalization Utility
 * Handles relative vs absolute paths across environments
 * Prevents broken images with consistent URL formatting
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * Normalizes image URLs for consistent rendering
 * @param {string} imagePath - Path from database or API
 * @returns {string} - Normalized absolute URL
 * 
 * Examples:
 * - uploads/avatar.jpg → http://localhost:5000/uploads/avatar.jpg
 * - /uploads/avatar.jpg → http://localhost:5000/uploads/avatar.jpg
 * - http://example.com/image.jpg → http://example.com/image.jpg
 */
export function normalizeImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }

  // Protocol-relative, data URI, or blob - leave as-is
  if (imagePath.startsWith('//') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Client-side static assets (served from the frontend) should not be
  // prefixed with the API/SERVER base. Keep them as-is so paths like
  // "/assets/..." continue to resolve from the client bundle.
  if (imagePath.startsWith('/assets') || imagePath.startsWith('/static') || imagePath.startsWith('/favicon')) {
    return imagePath;
  }

  // Already an absolute URL (http/https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Already starts with / - just prepend server base
  if (imagePath.startsWith('/')) {
    return `${SERVER_BASE_URL}${imagePath}`;
  }

  // Relative path - add leading slash
  return `${SERVER_BASE_URL}/${imagePath}`;
}

/**
 * Get profile picture URL with fallback
 * @param {string} profilePicture - User profile picture path
 * @param {string} defaultAvatar - Default avatar path
 * @returns {string} - Normalized image URL or default
 */
export function getProfileImageUrl(profilePicture, defaultAvatar = '/assets/images/user/img-02.jpg') {
  if (!profilePicture) {
    return defaultAvatar;
  }
  
  return normalizeImageUrl(profilePicture);
}

/**
 * Get company logo URL with fallback
 * @param {string} logo - Company logo path
 * @param {string} defaultLogo - Default logo path
 * @returns {string} - Normalized image URL or default
 */
export function getCompanyLogoUrl(logo, defaultLogo = '/assets/images/logo/company-default.png') {
  if (!logo) {
    return defaultLogo;
  }
  
  return normalizeImageUrl(logo);
}

/**
 * Handle image load error with fallback
 * @param {Event} event - Image error event
 * @param {string} fallbackSrc - Fallback image source
 */
export function handleImageError(event, fallbackSrc) {
  if (event.target.src !== fallbackSrc) {
    event.target.src = fallbackSrc;
    event.target.onerror = null; // Prevent infinite loop
  }
}

/**
 * Create image error handler with custom fallback
 * @param {string} fallbackSrc - Fallback image source
 * @returns {Function} - Event handler function
 */
export function createImageErrorHandler(fallbackSrc) {
  return (event) => handleImageError(event, fallbackSrc);
}
