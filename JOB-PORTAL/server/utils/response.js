// Consistent API response format
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export const sendError = (res, statusCode = 400, message = 'Error', code = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
  })
}
