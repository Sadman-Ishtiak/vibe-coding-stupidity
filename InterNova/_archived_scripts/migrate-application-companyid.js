/**
 * Migration Script: Populate companyId field in Application model
 * 
 * This script updates existing Application documents to include the companyId field
 * by looking up the associated Job's company field.
 * 
 * Usage: node scripts/migrate-application-companyid.js
 */

const mongoose = require('mongoose');
const Application = require('../server/models/Application');
const Job = require('../server/models/Job');
require('dotenv').config();

const migrateApplicationCompanyId = async () => {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB');

    // Find all applications without companyId
    const applicationsWithoutCompanyId = await Application.find({
      $or: [
        { companyId: { $exists: false } },
        { companyId: null }
      ]
    });

    console.log(`\n📊 Found ${applicationsWithoutCompanyId.length} applications to migrate\n`);

    if (applicationsWithoutCompanyId.length === 0) {
      console.log('✅ All applications already have companyId field');
      process.exit(0);
    }

    let successCount = 0;
    let errorCount = 0;
    let notFoundCount = 0;

    // Update each application
    for (const application of applicationsWithoutCompanyId) {
      try {
        // Find the associated job
        const job = await Job.findById(application.jobId);
        
        if (!job) {
          console.warn(`⚠️  Job not found for application ${application._id} (jobId: ${application.jobId})`);
          notFoundCount++;
          continue;
        }

        // Prefer Company record (owner == job.company) if exists, otherwise fall back to job.company
        const Company = require('../server/models/Company');
        const companyDoc = await Company.findOne({ owner: job.company }).select('_id');
        if (companyDoc) {
          application.companyId = companyDoc._id;
        } else {
          application.companyId = job.company;
        }
        await application.save();
        
        successCount++;
        
        if (successCount % 10 === 0) {
          console.log(`✅ Migrated ${successCount} applications...`);
        }
      } catch (err) {
        console.error(`❌ Error migrating application ${application._id}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⚠️  Jobs not found: ${notFoundCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${applicationsWithoutCompanyId.length}`);
    console.log('='.repeat(50) + '\n');

    // Verify migration
    const remainingWithoutCompanyId = await Application.countDocuments({
      $or: [
        { companyId: { $exists: false } },
        { companyId: null }
      ]
    });

    if (remainingWithoutCompanyId === 0) {
      console.log('✅ All applications now have companyId field!');
    } else {
      console.log(`⚠️  ${remainingWithoutCompanyId} applications still missing companyId`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run migration
console.log('🚀 Starting Application companyId migration...\n');
migrateApplicationCompanyId();
