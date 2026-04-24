/**
 * DRY RUN - MIGRATION PREVIEW (NO CHANGES MADE)
 * ==============================================
 * Preview what the migration will do WITHOUT making any changes.
 * 
 * Run with: node scripts/migrate-recruiters-to-company-dryrun.js
 */

const mongoose = require('../server/node_modules/mongoose');
const path = require('path');
require('../server/node_modules/dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import models (READ-ONLY)
const User = require('../server/models/User');
const Candidate = require('../server/models/Candidate');
const Company = require('../server/models/Company');

/**
 * DRY RUN - Analyze what would be migrated
 */
async function dryRun() {
  console.log('\n' + '='.repeat(60));
  console.log('DRY RUN - MIGRATION PREVIEW (NO CHANGES)');
  console.log('='.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    // Find all Users with role="recruiter"
    console.log('\n=== SCANNING FOR WRONG RECORDS ===');
    const recruiterUsers = await User.find({ role: 'recruiter' }).lean();
    console.log(`Found ${recruiterUsers.length} recruiter users in User collection`);
    
    if (recruiterUsers.length === 0) {
      console.log('\n✓ No recruiter users found. Nothing to migrate.');
      await mongoose.disconnect();
      return;
    }
    
    // Get their emails
    const recruiterEmails = recruiterUsers.map(u => u.email);
    
    // Find Candidate documents with these emails
    const wrongCandidates = await Candidate.find({
      email: { $in: recruiterEmails }
    }).lean();
    
    console.log(`Found ${wrongCandidates.length} Candidate records for recruiters (WRONG)`);
    
    if (wrongCandidates.length === 0) {
      console.log('\n✓ No wrong Candidate records found. Nothing to migrate.');
      await mongoose.disconnect();
      return;
    }
    
    // Display details
    console.log('\n=== RECORDS TO BE MIGRATED ===');
    
    for (const candidate of wrongCandidates) {
      const user = recruiterUsers.find(u => u.email === candidate.email);
      
      // Check if Company already exists
      const existingCompany = await Company.findOne({ owner: user._id });
      
      console.log('\n' + '-'.repeat(60));
      console.log(`Email: ${user.email}`);
      console.log(`User ID: ${user._id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Role: ${user.role}`);
      console.log(`Candidate ID: ${candidate._id}`);
      console.log(`Candidate Name: ${candidate.firstName} ${candidate.lastName}`);
      console.log(`Location: ${candidate.location || 'N/A'}`);
      console.log(`About: ${candidate.about ? candidate.about.substring(0, 50) + '...' : 'N/A'}`);
      
      if (existingCompany) {
        console.log(`⚠ Company Already Exists: ${existingCompany.name} (${existingCompany._id})`);
        console.log(`  → WILL SKIP (no duplicate created)`);
      } else {
        console.log(`✓ Will Create Company:`);
        console.log(`  - Name: ${user.username}`);
        console.log(`  - Description: ${candidate.about || 'Empty'}`);
        console.log(`  - Location: ${candidate.location || 'Empty'}`);
        console.log(`  - Owner: ${user._id}`);
        console.log(`  → WILL DELETE Candidate record ${candidate._id}`);
      }
    }
    
    // Summary
    const toMigrate = wrongCandidates.length;
    const existingCompanies = await Company.countDocuments({
      owner: { $in: recruiterUsers.map(u => u._id) }
    });
    const willCreate = toMigrate - existingCompanies;
    
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION SUMMARY (DRY RUN)');
    console.log('='.repeat(60));
    console.log(`Total Wrong Candidate Records: ${toMigrate}`);
    console.log(`Companies Already Exist: ${existingCompanies}`);
    console.log(`New Companies to Create: ${willCreate}`);
    console.log(`Candidate Records to Delete: ${willCreate}`);
    console.log('='.repeat(60));
    
    if (willCreate > 0) {
      console.log('\n⚠ To execute this migration, run:');
      console.log('   node scripts/migrate-recruiters-to-company.js');
    } else {
      console.log('\n✓ All recruiters already have Company records.');
      console.log('   You may still want to clean up wrong Candidate records.');
    }
    
  } catch (error) {
    console.error('\n✗ Dry run failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Run dry run
if (require.main === module) {
  dryRun()
    .then(() => {
      console.log('\nDry run complete.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nFatal error:', error);
      process.exit(1);
    });
}

module.exports = { dryRun };
