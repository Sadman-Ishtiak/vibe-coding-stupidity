/**
 * DATABASE STATE VERIFICATION
 * ============================
 * Verifies the current state of Users, Candidates, and Companies
 * 
 * Run with: node scripts/verify-database-state.js
 */

const mongoose = require('../server/node_modules/mongoose');
const path = require('path');
require('../server/node_modules/dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import models
const User = require('../server/models/User');
const Candidate = require('../server/models/Candidate');
const Company = require('../server/models/Company');

async function verifyState() {
  console.log('\n' + '='.repeat(60));
  console.log('DATABASE STATE VERIFICATION');
  console.log('='.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    // Get counts
    const totalUsers = await User.countDocuments();
    const candidateUsers = await User.countDocuments({ role: 'candidate' });
    const recruiterUsers = await User.countDocuments({ role: 'recruiter' });
    const totalCandidates = await Candidate.countDocuments();
    const totalCompanies = await Company.countDocuments();
    
    console.log('\n=== COLLECTION COUNTS ===');
    console.log(`Total Users: ${totalUsers}`);
    console.log(`  - Candidates: ${candidateUsers}`);
    console.log(`  - Recruiters: ${recruiterUsers}`);
    console.log(`Total Candidate Profiles: ${totalCandidates}`);
    console.log(`Total Companies: ${totalCompanies}`);
    
    // Check for wrong records
    console.log('\n=== CHECKING FOR INCONSISTENCIES ===');
    
    // Find recruiters with Candidate profiles (WRONG)
    const recruiters = await User.find({ role: 'recruiter' }).lean();
    const recruiterEmails = recruiters.map(r => r.email);
    const wrongCandidates = await Candidate.find({ 
      email: { $in: recruiterEmails } 
    }).lean();
    
    console.log(`Recruiters with wrong Candidate profiles: ${wrongCandidates.length}`);
    
    if (wrongCandidates.length > 0) {
      console.log('⚠ WARNING: Found incorrect Candidate records:');
      wrongCandidates.forEach(c => {
        console.log(`  - ${c.email} (ID: ${c._id})`);
      });
    } else {
      console.log('✓ No incorrect Candidate records found');
    }
    
    // Check recruiters without Companies
    const recruitersWithoutCompany = [];
    for (const recruiter of recruiters) {
      const company = await Company.findOne({ owner: recruiter._id });
      if (!company) {
        recruitersWithoutCompany.push(recruiter);
      }
    }
    
    console.log(`Recruiters without Company profiles: ${recruitersWithoutCompany.length}`);
    
    if (recruitersWithoutCompany.length > 0) {
      console.log('⚠ WARNING: Recruiters without Company:');
      recruitersWithoutCompany.forEach(r => {
        console.log(`  - ${r.email} (ID: ${r._id})`);
      });
    } else {
      console.log('✓ All recruiters have Company profiles');
    }
    
    // Check candidates without User profiles
    const allCandidates = await Candidate.find().lean();
    const candidatesWithoutUser = [];
    
    for (const candidate of allCandidates) {
      const user = await User.findOne({ email: candidate.email });
      if (!user) {
        candidatesWithoutUser.push(candidate);
      }
    }
    
    console.log(`Candidates without User profiles: ${candidatesWithoutUser.length}`);
    
    if (candidatesWithoutUser.length > 0) {
      console.log('⚠ WARNING: Orphaned Candidates:');
      candidatesWithoutUser.forEach(c => {
        console.log(`  - ${c.email} (ID: ${c._id})`);
      });
    } else {
      console.log('✓ All Candidates have User profiles');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    
    const issues = wrongCandidates.length + recruitersWithoutCompany.length + candidatesWithoutUser.length;
    
    if (issues === 0) {
      console.log('✓ DATABASE IS IN CORRECT STATE');
      console.log('✓ No migration needed');
    } else {
      console.log(`⚠ Found ${issues} issue(s) that may need attention`);
      if (wrongCandidates.length > 0) {
        console.log('  → Run migration to fix wrong Candidate records');
      }
      if (recruitersWithoutCompany.length > 0) {
        console.log('  → Some recruiters need Company profiles');
      }
      if (candidatesWithoutUser.length > 0) {
        console.log('  → Orphaned Candidates found (data cleanup needed)');
      }
    }
    
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n✗ Verification failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Run verification
if (require.main === module) {
  verifyState()
    .then(() => {
      console.log('\nVerification complete.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nFatal error:', error);
      process.exit(1);
    });
}

module.exports = { verifyState };
