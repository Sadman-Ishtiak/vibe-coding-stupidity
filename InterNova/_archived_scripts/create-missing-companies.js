/**
 * CREATE MISSING COMPANY PROFILES
 * ================================
 * Creates Company profiles for recruiter Users who don't have one yet.
 * This is NOT a migration - it's creating missing data.
 * 
 * Run with: node scripts/create-missing-companies.js
 */

const mongoose = require('../server/node_modules/mongoose');
const path = require('path');
require('../server/node_modules/dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import models
const User = require('../server/models/User');
const Company = require('../server/models/Company');

async function createMissingCompanies() {
  console.log('\n' + '='.repeat(60));
  console.log('CREATE MISSING COMPANY PROFILES');
  console.log('='.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    // Find all recruiters
    const recruiters = await User.find({ role: 'recruiter' }).lean();
    console.log(`\nFound ${recruiters.length} recruiter users`);
    
    // Find recruiters without Company profiles
    const recruitersNeedingCompany = [];
    for (const recruiter of recruiters) {
      const company = await Company.findOne({ owner: recruiter._id });
      if (!company) {
        recruitersNeedingCompany.push(recruiter);
      }
    }
    
    console.log(`Recruiters without Company: ${recruitersNeedingCompany.length}`);
    
    if (recruitersNeedingCompany.length === 0) {
      console.log('\n✓ All recruiters already have Company profiles.');
      await mongoose.disconnect();
      return;
    }
    
    // Show what will be created
    console.log('\n=== COMPANIES TO BE CREATED ===');
    recruitersNeedingCompany.forEach((r, idx) => {
      console.log(`${idx + 1}. ${r.username} (${r.email})`);
    });
    
    console.log(`\n⚠ About to create ${recruitersNeedingCompany.length} Company profiles.`);
    console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create Company profiles
    let created = 0;
    let errors = 0;
    
    console.log('\n=== CREATING COMPANIES ===');
    
    for (const recruiter of recruitersNeedingCompany) {
      try {
        const companyData = {
          name: recruiter.username || 'Company',
          description: recruiter.about || '',
          location: recruiter.location || '',
          owner: recruiter._id,
          logo: recruiter.profilePicture || '',
          website: '',
          employees: '',
          establishedDate: '',
          workingDays: 'Monday - Friday : 9AM - 5PM',
          weekend: 'Sunday : Closed',
          facebook: recruiter.social?.facebook || '',
          linkedin: recruiter.social?.linkedin || '',
          whatsapp: recruiter.social?.whatsapp || '',
          gallery: []
        };
        
        const newCompany = await Company.create(companyData);
        console.log(`✓ Created: ${newCompany.name} (ID: ${newCompany._id})`);
        created++;
        
      } catch (error) {
        console.error(`✗ Failed for ${recruiter.email}: ${error.message}`);
        errors++;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Successfully Created: ${created}`);
    console.log(`Errors: ${errors}`);
    console.log('='.repeat(60));
    
    if (created > 0) {
      console.log('\n✓ Company profiles created successfully!');
    }
    
  } catch (error) {
    console.error('\n✗ Operation failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Run
if (require.main === module) {
  createMissingCompanies()
    .then(() => {
      console.log('\nOperation complete.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nFatal error:', error);
      process.exit(1);
    });
}

module.exports = { createMissingCompanies };
