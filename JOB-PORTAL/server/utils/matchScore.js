export const calculateMatchScore = (candidateSkills = [], jobSkills = []) => {
  if (!jobSkills || !jobSkills.length) return 0

  const matched = candidateSkills.filter((s) => jobSkills.includes(s))

  return Math.round((matched.length / jobSkills.length) * 100)
}

export default { calculateMatchScore }
