import axios from 'axios'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api'
const EMAIL_DIR = path.join(process.cwd(), 'server', 'emails')

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

const testEmail = `e2e_test_${Date.now()}@example.com`
const testPassword = 'TestPass123!'

async function run() {
  try {
    console.log('E2E: starting password reset flow test')

    // ensure emails dir exists
    fs.mkdirSync(EMAIL_DIR, { recursive: true })

    // Sign up test user
    console.log('Signing up test user...')
    await axios.post(`${API_BASE}/auth/sign-up`, {
      username: `e2e_user_${Date.now()}`,
      email: testEmail,
      password: testPassword,
      accountType: 'candidate'
    }).catch(e => {
      if (e.response) console.log('Signup response:', e.response.status, e.response.data)
      else console.error('Signup error', e.message)
    })

    // Trigger forgot-password
    console.log('Requesting forgot-password...')
    await axios.post(`${API_BASE}/auth/forgot-password`, { email: testEmail })

    // Wait a bit for sendEmail to write file
    await sleep(500)

    // Read latest email file for this recipient
    const files = fs.readdirSync(EMAIL_DIR).filter(f => f.includes(testEmail.replace(/[@.]/g, '_')))
    if (!files || files.length === 0) {
      console.error('No email file found for', testEmail)
      process.exit(1)
    }

    files.sort()
    const latest = files[files.length - 1]
    const content = fs.readFileSync(path.join(EMAIL_DIR, latest), 'utf8')
    const otpMatch = content.match(/<h2>(\d{4,8})<\/h2>/)
    if (!otpMatch) {
      console.error('Failed to extract OTP from email content')
      console.log('Email content preview:\n', content.slice(0, 400))
      process.exit(1)
    }

    const otp = otpMatch[1]
    console.log('Extracted OTP:', otp)

    // Reset password using OTP
    const newPassword = 'NewPass123!'
    const res = await axios.post(`${API_BASE}/auth/reset-password`, {
      email: testEmail,
      otp,
      password: newPassword,
    })

    console.log('Reset password response:', res.data)

    // Try signing in with new password
    const login = await axios.post(`${API_BASE}/auth/login`, { email: testEmail, password: newPassword })
    console.log('Login response success:', login.data && login.data.success)

    console.log('E2E: password reset flow test complete')
    process.exit(0)
  } catch (err) {
    console.error('E2E test failed', err.response ? err.response.data : err.message)
    process.exit(1)
  }
}

run()
