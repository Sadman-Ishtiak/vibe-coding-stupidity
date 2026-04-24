export function calculateProfileCompletion(user) {
  let score = 0

  // Basic Info (25)
  if (user?.firstName && user?.lastName && user?.designation && user?.phone && user?.location) {
    score += 25
  }

  // About (15)
  if (user?.about && String(user.about).length > 50) {
    score += 15
  }

  // Education (15)
  if (Array.isArray(user?.education) && user.education.length > 0) {
    score += 15
  }

  // Experience (15)
  if (Array.isArray(user?.experience) && user.experience.length > 0) {
    score += 15
  }

  // Skills (10)
  if (Array.isArray(user?.skills) && user.skills.length > 0) {
    score += 10
  }

  // Languages (10)
  if (Array.isArray(user?.languages) && user.languages.length > 0) {
    score += 10
  }

  // Resume (10)
  if (user?.resume) {
    score += 10
  }

  return Math.min(score, 100)
}
