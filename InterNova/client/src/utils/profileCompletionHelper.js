/**
 * Frontend Profile Completion Helper Utilities
 * Provides validation, checks, and helper functions for profile completion
 */

/**
 * Check if user can apply for jobs
 * @param {Object} user - User object from auth context
 * @param {number} profileCompletion - Profile completion percentage
 * @returns {Object} - { canApply: boolean, reason: string, redirectTo: string }
 */
export const canApplyForJob = (user, profileCompletion) => {
  // Guest users must login
  if (!user || !user.id) {
    return {
      canApply: false,
      reason: 'Please login to apply for jobs',
      redirectTo: '/sign-in'
    };
  }

  // Company users cannot apply
  if (user.role === 'company' || user.role === 'recruiter') {
    return {
      canApply: false,
      reason: 'Companies cannot apply for jobs',
      redirectTo: null
    };
  }

  // Candidate must have complete profile
  if (user.role === 'candidate' && profileCompletion < 100) {
    return {
      canApply: false,
      reason: `Complete your profile (${profileCompletion}%) to apply for jobs`,
      redirectTo: '/candidate/profile'
    };
  }

  return {
    canApply: true,
    reason: null,
    redirectTo: null
  };
};

/**
 * Check if company can post jobs
 * @param {Object} user - User object from auth context
 * @param {number} profileCompletion - Profile completion percentage
 * @returns {Object} - { canPost: boolean, reason: string, redirectTo: string }
 */
export const canPostJob = (user, profileCompletion) => {
  // Must be logged in
  if (!user || !user.id) {
    return {
      canPost: false,
      reason: 'Please login to post jobs',
      redirectTo: '/sign-in'
    };
  }

  // Only companies can post
  if (user.role !== 'company' && user.role !== 'recruiter') {
    return {
      canPost: false,
      reason: 'Only companies can post jobs',
      redirectTo: null
    };
  }

  // Company must have complete profile
  if (profileCompletion < 100) {
    return {
      canPost: false,
      reason: `Complete your company profile (${profileCompletion}%) to post jobs`,
      redirectTo: '/company/profile'
    };
  }

  return {
    canPost: true,
    reason: null,
    redirectTo: null
  };
};

/**
 * Get profile completion message for candidates
 * @param {number} completion - Completion percentage
 * @returns {Object} - { message: string, severity: string }
 */
export const getCandidateCompletionMessage = (completion) => {
  if (completion === 100) {
    return {
      message: 'Your profile is complete! You can apply for jobs.',
      severity: 'success'
    };
  }
  
  if (completion >= 75) {
    return {
      message: 'Almost there! Complete your profile to start applying.',
      severity: 'info'
    };
  }
  
  if (completion >= 50) {
    return {
      message: 'You\'re halfway there. Keep going!',
      severity: 'warning'
    };
  }
  
  return {
    message: 'Complete your profile to unlock job applications.',
    severity: 'error'
  };
};

/**
 * Get profile completion message for companies
 * @param {number} completion - Completion percentage
 * @returns {Object} - { message: string, severity: string }
 */
export const getCompanyCompletionMessage = (completion) => {
  if (completion === 100) {
    return {
      message: 'Your company profile is complete! You can post jobs.',
      severity: 'success'
    };
  }
  
  if (completion >= 75) {
    return {
      message: 'Almost done! Complete your profile to start posting jobs.',
      severity: 'info'
    };
  }
  
  if (completion >= 50) {
    return {
      message: 'You\'re halfway there. Keep building your company profile!',
      severity: 'warning'
    };
  }
  
  return {
    message: 'Complete your company profile to post job opportunities.',
    severity: 'error'
  };
};

/**
 * Get missing fields suggestions (client-side calculation for hints)
 * Note: This is just for UI hints - actual validation is server-side
 */
export const getMissingFieldsSuggestions = (profile, role) => {
  const suggestions = [];
  
  if (role === 'candidate') {
    if (!profile.profilePicture) suggestions.push('Add a profile picture');
    if (!profile.phone) suggestions.push('Add your phone number');
    if (!profile.education || profile.education.length === 0) suggestions.push('Add education details');
    if (!profile.skills || profile.skills.length === 0) suggestions.push('Add your skills');
    if (!profile.resume) suggestions.push('Upload your resume');
    if (!profile.location) suggestions.push('Add your location');
    if (!profile.experience && !profile.internships) suggestions.push('Add experience or internship');
  }
  
  if (role === 'company') {
    if (!profile.logo) suggestions.push('Upload company logo');
    if (!profile.description) suggestions.push('Add company description');
    if (!profile.website) suggestions.push('Add company website');
    if (!profile.location) suggestions.push('Add company location');
    if (!profile.establishedDate) suggestions.push('Add establishment date');
    if (!profile.numberOfEmployees) suggestions.push('Add number of employees');
  }
  
  return suggestions;
};

export default {
  canApplyForJob,
  canPostJob,
  getCandidateCompletionMessage,
  getCompanyCompletionMessage,
  getMissingFieldsSuggestions
};
