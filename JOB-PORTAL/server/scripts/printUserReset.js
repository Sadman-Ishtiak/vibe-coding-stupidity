import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const email = process.argv[2]
if (!email) {
  console.error('Usage: node printUserReset.js <email>')
  process.exit(2)
}

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/internnova'

async function run() {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  const user = await User.findOne({ email: email.toLowerCase().trim() }).lean()
  console.log(user)
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })
