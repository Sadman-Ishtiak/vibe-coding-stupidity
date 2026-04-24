import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { generateOtp } from '../utils/otp.js'
import { sendEmail } from '../utils/sendEmail.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { setRefreshCookie } from '../middleware/setCookie.js'

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  })

  const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  })

  return { accessToken, refreshToken }
}

export const signUp = async (req, res) => {
  try {
    const { username, email, password, accountType } = req.body
    const normalizedEmail = email?.toLowerCase().trim()
    const normalizedUsername = username?.trim()
    const role = ['candidate', 'recruiter'].includes(accountType)
      ? accountType
      : 'candidate'

    if (!normalizedUsername || !normalizedEmail || !password) {
      return sendError(res, 400, 'All fields are required')
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return sendError(res, 409, 'Email already registered')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      profilePicture: req.file
        ? `/uploads/profile-pictures/${req.file.filename}`
        : null,
    })

    const tokens = generateTokens(user)
    setRefreshCookie(res, tokens.refreshToken)

    const userPayload = {
      id: String(user._id),
      username: user.name,
      email: user.email,
      role: user.role,
      accountType: user.role,
      profilePicture: user.profilePicture,
      profileImageUrl: user.profilePicture,
    }

    // Frontend expects token/user under data.*
    // Keep top-level token/user for compatibility with any older callers.
    return sendSuccess(res, 201, 'Account created successfully', {
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
      user: userPayload,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return sendError(res, 500, 'Server error. Please try again.')
  }
}

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body
    const identifier = (email ?? username ?? '').trim()
    const normalizedEmail = identifier.toLowerCase()

    if (!identifier || !password) {
      return sendError(res, 400, 'Email/username and password are required')
    }

    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { name: identifier }],
    })
    if (!user) {
      return sendError(res, 401, 'Invalid credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials')
    }

    const tokens = generateTokens(user)
    setRefreshCookie(res, tokens.refreshToken)

    const userPayload = {
      id: String(user._id),
      username: user.name,
      email: user.email,
      role: user.role,
      accountType: user.role,
      profilePicture: user.profilePicture || null,
      profileImageUrl: user.profilePicture || null,
    }

    return sendSuccess(res, 200, 'Signed in successfully', {
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
      user: userPayload,
    })
  } catch (error) {
    console.error('Login error:', error)
    return sendError(res, 500, 'Server error')
  }
}

export const refresh = async (req, res) => {
  try {
    // Prefer cookie first
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!refreshToken) return sendError(res, 400, 'Refresh token required')

    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret')
    } catch (err) {
      return sendError(res, 401, 'Invalid refresh token')
    }

    const user = await User.findById(decoded.id)
    if (!user) return sendError(res, 404, 'User not found')

    const tokens = generateTokens(user)
    setRefreshCookie(res, tokens.refreshToken)

    return sendSuccess(res, 'Token refreshed', {
      accessToken: tokens.accessToken,
    })
  } catch (err) {
    console.error('Refresh token error:', err)
    return sendError(res, 500, 'Server error')
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const user = await User.findOne({ email: normalizedEmail })

    // Always return same response (security)
    if (!user) {
      return res.json({ success: true, message: 'If the email exists, an OTP has been sent' })
    }

    const { otp, hashedOtp } = generateOtp()

    user.resetOtp = hashedOtp
    user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save({ validateBeforeSave: false })

    await sendEmail({
      to: user.email,
      subject: 'InternNova Password Reset OTP',
      html: `
        <h3>Password Reset</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    })

    res.json({ success: true, message: 'OTP sent to email' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and password are required',
      })
    }

    const hashedOtp = crypto
      .createHash('sha256')
      .update(String(otp))
      .digest('hex')

    const user = await User.findOne({
      email: normalizedEmail,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }

    // Model does not hash on save; hash here.
    user.password = await bcrypt.hash(password, 10)
    user.resetOtp = undefined
    user.resetOtpExpire = undefined

    await user.save({ validateBeforeSave: false })

    res.json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ===== SESSION HELPERS (Frontend expects /auth/me and /auth/sign-out) =====

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return sendError(res, 401, 'Unauthorized')

    const user = await User.findById(userId).select('-password')
    if (!user) return sendError(res, 404, 'User not found')

    // The client header hydrator expects this under res.data
    const data = {
      id: String(user._id),
      username: user.username,
      email: user.email,
      role: user.role,
      accountType: user.role,
      profilePicture: user.profilePicture || null,
      profileImageUrl: user.profilePicture || null,
    }

    return sendSuccess(res, 200, 'Authenticated user retrieved', data)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const signOut = async (req, res) => {
  // JWT is stored client-side; server-side sign out is a no-op.
  return res.json({ success: true, message: 'Signed out' })
}
