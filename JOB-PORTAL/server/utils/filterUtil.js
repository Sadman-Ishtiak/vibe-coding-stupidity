export const filterJobs = (jobs = [], filters = {}) => {
  let result = jobs
  if (!filters) return result

  const { location, category, salaryMin, salaryMax, skills } = filters

  if (location) {
    const loc = String(location).toLowerCase()
    result = result.filter((j) => (j.location || '').toLowerCase().includes(loc))
  }

  if (category) {
    const cat = String(category).toLowerCase()
    result = result.filter((j) => (j.category || '').toLowerCase().includes(cat))
  }

  if (salaryMin) {
    const min = Number(salaryMin)
    result = result.filter((j) => Number(j.salaryMin || 0) >= min)
  }

  if (salaryMax) {
    const max = Number(salaryMax)
    result = result.filter((j) => Number(j.salaryMax || 0) <= max)
  }

  if (skills) {
    const wanted = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim()).filter(Boolean)
    if (wanted.length) {
      result = result.filter((j) => Array.isArray(j.skills) && wanted.every(w => j.skills.includes(w)))
    }
  }

  return result
}

export default filterJobs
