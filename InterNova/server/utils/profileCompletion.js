/**
 * Profile Completion Calculation Utilities
 * Calculates weighted profile completion percentage for Candidates and Companies
 * Returns integer percentage (0-100) without persisting to database
 */

/**
 * Calculate Candidate Profile Completion
 * @param {Object} candidate - Candidate profile object
 * @returns {Number} - Profile completion percentage (0-100)
 */
const calculateCandidateProfileCompletion = (candidate) => {
  if (!candidate) return 0;

  let totalScore = 0;

  // Basic Info (25%)
  let basicInfoScore = 0;
  const basicInfoFields = [
    candidate.username,
    candidate.email,
    candidate.phone,
    candidate.profilePicture || candidate.profileImage
  ];
  const basicInfoCompleted = basicInfoFields.filter(field => field && field.toString().trim() !== '').length;
  basicInfoScore = (basicInfoCompleted / 4) * 25;
  totalScore += basicInfoScore;

  // Education (20%)
  const hasEducation = candidate.education && Array.isArray(candidate.education) && candidate.education.length > 0;
  if (hasEducation) totalScore += 20;

  // Skills (20%)
  const hasSkills = candidate.skills && Array.isArray(candidate.skills) && candidate.skills.length > 0;
  if (hasSkills) totalScore += 20;

  // Experience OR Internship (15%)
  const hasExperience = candidate.experience && Array.isArray(candidate.experience) && candidate.experience.length > 0;
  const hasInternship = candidate.internships && Array.isArray(candidate.internships) && candidate.internships.length > 0;
  if (hasExperience || hasInternship) totalScore += 15;

  // Resume Upload (10%)
  const hasResume = candidate.resume && (typeof candidate.resume === 'string' ? candidate.resume.trim() !== '' : candidate.resume.fileUrl && candidate.resume.fileUrl.trim() !== '');
  if (hasResume) totalScore += 10;

  // Location & Preferences (10%)
  let locationPrefScore = 0;
  const locationPrefFields = [
    candidate.location,
    candidate.jobTypePreference
  ];
  const locationPrefCompleted = locationPrefFields.filter(field => field && field.toString().trim() !== '').length;
  locationPrefScore = (locationPrefCompleted / 2) * 10;
  totalScore += locationPrefScore;

  return Math.round(totalScore);
};

/**
 * Calculate Company Profile Completion
 * @param {Object} company - Company profile object
 * @returns {Number} - Profile completion percentage (0-100)
 */
const calculateCompanyProfileCompletion = (company) => {
  if (!company) return 0;

  let totalScore = 0;

  // Basic Info (25%)
  let basicInfoScore = 0;
  const basicInfoFields = [
    company.companyName || company.userId?.name || company.username,
    company.email || company.userId?.email,
    company.phone,
    company.logo
  ];
  const basicInfoCompleted = basicInfoFields.filter(field => field && field.toString().trim() !== '').length;
  basicInfoScore = (basicInfoCompleted / 4) * 25;
  totalScore += basicInfoScore;

  // Company Details (20%)
  let companyDetailsScore = 0;
  const companyDetailsFields = [
    company.companyDescription || company.description,
    company.companyWebsite || company.website,
    company.establishedDate
  ];
  const companyDetailsCompleted = companyDetailsFields.filter(field => field && field.toString().trim() !== '').length;
  companyDetailsScore = (companyDetailsCompleted / 3) * 20;
  totalScore += companyDetailsScore;

  // Location & Size (15%)
  let locationSizeScore = 0;
  const locationSizeFields = [
    company.companyLocation || company.location,
    company.employees || company.numberOfEmployees
  ];
  const locationSizeCompleted = locationSizeFields.filter(field => field && field.toString().trim() !== '').length;
  locationSizeScore = (locationSizeCompleted / 2) * 15;
  totalScore += locationSizeScore;

  // Working Schedule (15%) - At least 5 working days marked open
  let workingScheduleScore = 0;
  if (company.workingSchedule && typeof company.workingSchedule === 'object') {
    const workingDays = Object.values(company.workingSchedule).filter(day => 
      day && day.isOpen === true
    ).length;
    if (workingDays >= 5) workingScheduleScore = 15;
  }
  totalScore += workingScheduleScore;

  // Social & Branding (10%) - At least one social link OR gallery image
  let socialBrandingScore = 0;
  const hasSocialLinks = company.socialLinks && (
    (company.socialLinks.linkedin && company.socialLinks.linkedin.trim() !== '') ||
    (company.socialLinks.twitter && company.socialLinks.twitter.trim() !== '') ||
    (company.socialLinks.facebook && company.socialLinks.facebook.trim() !== '')
  );
  const hasGallery = company.gallery && Array.isArray(company.gallery) && company.gallery.length > 0;
  if (hasSocialLinks || hasGallery) socialBrandingScore = 10;
  totalScore += socialBrandingScore;

  // Verification & Status (15%)
  let verificationScore = 0;
  const verificationFields = [
    company.isActive !== false, // Profile active
    company.userId?.isVerified // Email verified or similar
  ];
  const verificationCompleted = verificationFields.filter(field => field === true).length;
  verificationScore = (verificationCompleted / 2) * 15;
  totalScore += verificationScore;

  return Math.round(totalScore);
};

module.exports = {
  calculateCandidateProfileCompletion,
  calculateCompanyProfileCompletion
};
