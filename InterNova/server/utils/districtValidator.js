/**
 * Bangladesh Districts Data for Backend Validation
 * Complete list of all 64 districts in Bangladesh
 * MUST be kept in sync with client/src/data/bangladeshDistricts.js
 */

const BANGLADESH_DISTRICTS = [
  'Bagerhat',
  'Bahadia',
  'Bandarban',
  'Barguna',
  'Barishal',
  'Bhola',
  'Bogura',
  'Brahmanbaria',
  'Chandpur',
  'Chapainawabganj',
  'Chattogram',
  'Chuadanga',
  'Cox\'s Bazar',
  'Cumilla',
  'Dhaka',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokathi',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachari',
  'Khulna',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Mymensingh',
  'Naogaon',
  'Narail',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rajshahi',
  'Rangamati',
  'Rangpur',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Sylhet',
  'Tangail',
  'Thakurgaon'
];

/**
 * Check if a district name is valid
 * @param {string} districtName - District name to validate
 * @returns {boolean} True if district exists
 */
const isValidDistrict = (districtName) => {
  if (!districtName || typeof districtName !== 'string') {
    return false;
  }
  
  // Normalize and check (case-insensitive comparison)
  const normalized = districtName.trim();
  return BANGLADESH_DISTRICTS.some(d => d.toLowerCase() === normalized.toLowerCase());
};

/**
 * Normalize district name to match the standard format
 * @param {string} districtName - District name to normalize
 * @returns {string|null} Normalized district name or null if invalid
 */
const normalizeDistrict = (districtName) => {
  if (!districtName || typeof districtName !== 'string') {
    return null;
  }
  
  const normalized = districtName.trim();
  const found = BANGLADESH_DISTRICTS.find(d => d.toLowerCase() === normalized.toLowerCase());
  return found || null;
};

/**
 * Express middleware to validate district field in request body
 * @param {string} fieldName - Name of the field to validate (default: 'location')
 * @returns {Function} Express middleware
 * 
 * @example
 * router.post('/job', validateDistrict('location'), createJob);
 * router.patch('/profile', validateDistrict('companyLocation'), updateProfile);
 */
const validateDistrict = (fieldName = 'location') => {
  return (req, res, next) => {
    if (!req.body) req.body = {};
    const districtValue = req.body[fieldName];
    
    // Skip validation if field is not provided or is empty (optional field)
    if (!districtValue || districtValue === '') {
      return next();
    }
    
    // Special case: Allow "Remote" for job locations
    // Guard against non-string values to avoid runtime errors
    if (fieldName === 'location' && typeof districtValue === 'string' && districtValue.toLowerCase() === 'remote') {
      req.body[fieldName] = 'Remote';
      return next();
    }
    
    // Validate and normalize the district
    const normalizedDistrict = normalizeDistrict(districtValue);
    
    if (!normalizedDistrict) {
      return res.status(400).json({
        success: false,
        message: `Invalid district: "${districtValue}". Please select a valid Bangladesh district.`,
        field: fieldName
      });
    }
    
    // Update request body with normalized district name
    req.body[fieldName] = normalizedDistrict;
    next();
  };
};

/**
 * Validate multiple district fields in request body
 * @param {string[]} fieldNames - Array of field names to validate
 * @returns {Function} Express middleware
 * 
 * @example
 * router.post('/profile', validateMultipleDistricts(['location', 'companyLocation']), updateProfile);
 */
const validateMultipleDistricts = (fieldNames = []) => {
  return (req, res, next) => {
    if (!req.body) req.body = {};
    const errors = [];
    
    for (const fieldName of fieldNames) {
      const districtValue = req.body[fieldName];
      
      // Skip if not provided
      if (!districtValue || districtValue === '') {
        continue;
      }
      
      // Allow "Remote" for location fields
      // Guard against non-string values (some clients may send objects)
      if (fieldName === 'location' && typeof districtValue === 'string' && districtValue.toLowerCase() === 'remote') {
        req.body[fieldName] = 'Remote';
        continue;
      }
      
      const normalizedDistrict = normalizeDistrict(districtValue);
      
      if (!normalizedDistrict) {
        errors.push({
          field: fieldName,
          value: districtValue,
          message: `Invalid district: "${districtValue}"`
        });
      } else {
        req.body[fieldName] = normalizedDistrict;
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district(s) provided',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  BANGLADESH_DISTRICTS,
  isValidDistrict,
  normalizeDistrict,
  validateDistrict,
  validateMultipleDistricts
};
