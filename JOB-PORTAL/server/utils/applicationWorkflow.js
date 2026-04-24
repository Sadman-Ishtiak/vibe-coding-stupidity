export const allowedTransitions = {
  Applied: ['Shortlisted', 'Rejected'],
  Shortlisted: ['Interview', 'Rejected'],
  Interview: ['Selected', 'Rejected'],
  Selected: [],
  Rejected: [],
}

export const canTransition = (from, to) => allowedTransitions[from]?.includes(to)

export default { allowedTransitions, canTransition }
