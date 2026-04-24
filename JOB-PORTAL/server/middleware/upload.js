import multer from 'multer'
import path from 'path'
import fs from 'fs'

const profilePicturesDir = 'uploads/profile-pictures'
const resumesDir = 'uploads/resumes'
fs.mkdirSync(profilePicturesDir, { recursive: true })
fs.mkdirSync(resumesDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') return cb(null, resumesDir)
    return cb(null, profilePicturesDir)
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueName + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (allowed.includes(file.mimetype)) return cb(null, true)
    return cb(new Error('Only PDF/DOC/DOCX resumes allowed'), false)
  }

  if (file.mimetype.startsWith('image/')) return cb(null, true)
  return cb(new Error('Only images allowed'), false)
}

export const upload = multer({ storage, fileFilter })

export default upload
