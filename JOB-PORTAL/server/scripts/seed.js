import dotenv from 'dotenv'
import mongoose from 'mongoose'

import connectDB from '../config/db.js'
import User from '../models/User.js'
import Company from '../models/Company.js'
import Internship from '../models/Internship.js'

dotenv.config()

const pick = (envKey, fallback) => {
  const v = process.env[envKey]
  return v == null || v === '' ? fallback : v
}

async function seed() {
  await connectDB()

  const recruiterUsername = pick('SEED_RECRUITER_USERNAME', 'recruiter1')
  const recruiterEmail = pick('SEED_RECRUITER_EMAIL', 'recruiter1@example.com')
  const recruiterPassword = pick('SEED_RECRUITER_PASSWORD', 'Password123!')

  const candidateUsername = pick('SEED_CANDIDATE_USERNAME', 'candidate1')
  const candidateEmail = pick('SEED_CANDIDATE_EMAIL', 'candidate1@example.com')
  const candidatePassword = pick('SEED_CANDIDATE_PASSWORD', 'Password123!')

  const companyName = pick('SEED_COMPANY_NAME', 'InternNova Inc')
  const companyLogoUrl = pick('SEED_COMPANY_LOGO_URL', 'https://via.placeholder.com/256')
  const companyLocation = pick('SEED_COMPANY_LOCATION', 'Remote')
  const companyWebsite = pick('SEED_COMPANY_WEBSITE', 'https://example.com')
  const companyDescription = pick('SEED_COMPANY_DESCRIPTION', 'Seeded company for demo purposes.')

  // Create recruiter
  let recruiter = await User.findOne({ username: recruiterUsername })
  if (!recruiter) {
    recruiter = await User.create({
      username: recruiterUsername,
      email: recruiterEmail,
      password: recruiterPassword,
      accountType: 'recruiter',
    })
  }

  // Create candidate
  let candidate = await User.findOne({ username: candidateUsername })
  if (!candidate) {
    candidate = await User.create({
      username: candidateUsername,
      email: candidateEmail,
      password: candidatePassword,
      accountType: 'candidate',
    })
  }

  // Create company
  let company = await Company.findOne({ name: companyName })
  if (!company) {
    company = await Company.create({
      name: companyName,
      logoUrl: companyLogoUrl,
      location: companyLocation,
      website: companyWebsite,
      description: companyDescription,
      recruiter: recruiter._id,
    })
  }

  // Create jobs
  const existingJobs = await Internship.find({ recruiter: recruiter._id }).limit(1)
  if (existingJobs.length === 0) {
    await Internship.create([
      {
        title: 'Frontend Intern',
        companyId: company._id,
        companyName: company.name,
        companyLogoUrl: company.logoUrl,
        location: 'Remote',
        salaryText: '$500 / month',
        badges: ['Internship'],
        experienceText: '0-1 years',
        notes: 'Great for beginners.',
        descriptionHtml: '<p>Build UI features in React.</p>',
        recruiter: recruiter._id,
        isActive: true,
      },
      {
        title: 'Backend Intern',
        companyId: company._id,
        companyName: company.name,
        companyLogoUrl: company.logoUrl,
        location: 'Remote',
        salaryText: '$600 / month',
        badges: ['Internship'],
        experienceText: '0-1 years',
        notes: 'Work with Node/Express.',
        descriptionHtml: '<p>Build APIs in Node.js.</p>',
        recruiter: recruiter._id,
        isActive: true,
      },
      {
        title: 'Fullstack Intern',
        companyId: company._id,
        companyName: company.name,
        companyLogoUrl: company.logoUrl,
        location: 'Remote',
        salaryText: '$700 / month',
        badges: ['Internship', 'Urgent'],
        experienceText: '0-2 years',
        notes: 'Mix of frontend + backend.',
        descriptionHtml: '<p>Build features end-to-end.</p>',
        recruiter: recruiter._id,
        isActive: true,
      },
    ])
  }

  console.log('Seed complete')
  console.log('Recruiter:', recruiterUsername, recruiterEmail)
  console.log('Candidate:', candidateUsername, candidateEmail)
  console.log('Company:', companyName)

  await mongoose.connection.close()
}

seed().catch(async (err) => {
  console.error('Seed failed:', err)
  try {
    await mongoose.connection.close()
  } catch {
    // ignore
  }
  process.exit(1)
})
