export const success = (res, message, data = {}, meta = {}) => {
  return res.status(200).json({ success: true, message, data, meta })
}

export const error = (res, status = 400, message = 'Error') => {
  return res.status(status).json({ success: false, message })
}

export default { success, error }
