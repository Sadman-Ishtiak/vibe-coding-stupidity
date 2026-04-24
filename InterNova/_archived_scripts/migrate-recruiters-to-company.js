/**
 * ONE-TIME SAFE DATA MIGRATION SCRIPT
 * ====================================
 * Migrates incorrectly stored recruiter records from Candidate collection to Company collection.
 * 
 * CRITICAL: Does NOT modify any schemas or Candidate-related functionality.
 * 
 * Run with: node scripts/migrate-recruiters-to-company.js
 */

const mongoose = require('../server/node_modules/mongoose');
const fs = require('fs');
const path = require('path');
require('../server/node_modules/dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import models (READ-ONLY - NO SCHEMA CHANGES)
const User = require('../server/models/User');
const Candidate = require('../server/models/Candidate');
const Company = require('../server/models/Company');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'migration-backups');
const BACKUP_FILE = path.join(BACKUP_DIR, `recruiter-candidates-backup-${Date.now()}.json`);
const LOG_FILE = path.join(BACKUP_DIR, `migration-log-${Date.now()}.json`);

// Migration state
const migrationLog = {
  startTime: new Date().toISOString(),
  totalProcessed: 0,
  successfulMigrations: 0,
  errors: [],
  details: []
};

/**
 * Initialize backup directory
 */
function initBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`✓ Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * STEP 1: Identify wrong records (READ-ONLY SCAN)
 * Find Candidate documents linked to Users with role="recruiter"
 */
async function identifyWrongRecords() {
  console.log('\n=== STEP 1: IDENTIFYING WRONG RECORDS ===');
  
  try {
    // Find all Users with role="recruiter"
    const recruiterUsers = await User.find({ role: 'recruiter' }).lean();
    console.log(`Found ${recruiterUsers.length} recruiter users`);
    
    if (recruiterUsers.length === 0) {
      console.log('No recruiter users found. Nothing to migrate.');
      return [];
    }
    
    // Get their emails
    const recruiterEmails = recruiterUsers.map(u => u.email);
    
    // Find Candidate documents with these emails (WRONG RECORDS)
    const wrongCandidates = await Candidate.find({
      email: { $in: recruiterEmails }
    }).lean();
    
    console.log(`Found ${wrongCandidates.length} incorrectly stored recruiter Candidates`);
    
    // Match candidates with their users
    const wrongRecords = wrongCandidates.map(candidate => {
      const user = recruiterUsers.find(u => u.email === candidate.email);
      return {
        candidate,
        user
      };
    });
    
    return wrongRecords;
    
  } catch (error) {
    console.error('Error identifying wrong records:', error);
    migrationLog.errors.push({
      step: 'identify',
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * STEP 2: Backup affected records (MANDATORY)
 */
async function backupRecords(wrongRecords) {
  console.log('\n=== STEP 2: BACKING UP RECORDS ===');
  
  const backup = wrongRecords.map(({ candidate, user }) => ({
    candidateId: candidate._id.toString(),
    userId: user._id.toString(),
    email: user.email,
    candidateData: candidate,
    userData: {
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    },
    backupTimestamp: new Date().toISOString()
  }));
  
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
  console.log(`✓ Backed up ${backup.length} records to: ${BACKUP_FILE}`);
  
  return backup;
}

/**
 * STEP 3: Create Company documents
 */
async function createCompanyDocuments(wrongRecords) {
  console.log('\n=== STEP 3: CREATING COMPANY DOCUMENTS ===');
  
  const results = [];
  
  for (const { candidate, user } of wrongRecords) {
    migrationLog.totalProcessed++;
    
    try {
      // Check if Company already exists for this user
      const existingCompany = await Company.findOne({ owner: user._id });
      
      if (existingCompany) {
        console.log(`⚠ Company already exists for user ${user.email} (${existingCompany._id})`);
        migrationLog.details.push({
          userId: user._id.toString(),
          email: user.email,
          status: 'skipped',
          reason: 'Company already exists',
          existingCompanyId: existingCompany._id.toString(),
          timestamp: new Date().toISOString()
        });
        continue;
      }
      
      // Create new Company document using Company schema
      const companyData = {
        name: user.username || 'Company Name', // fallback safe
        description: candidate.about || '', // if exists
        location: candidate.location || '',
        owner: user._id,
        // Leave optional fields empty if data not available
        logo: candidate.profileImage || '',
        website: '',
        employees: '',
        establishedDate: '',
        workingDays: 'Monday - Friday : 9AM - 5PM',
        weekend: 'Sunday : Closed',
        facebook: '',
        linkedin: '',
        whatsapp: '',
        gallery: []
      };
      
      const newCompany = await Company.create(companyData);
      
      console.log(`✓ Created Company: ${newCompany.name} (ID: ${newCompany._id})`);
      
      migrationLog.successfulMigrations++;
      migrationLog.details.push({
        userId: user._id.toString(),
        email: user.email,
        oldCandidateId: candidate._id.toString(),
        newCompanyId: newCompany._id.toString(),
        status: 'success',
        timestamp: new Date().toISOString()
      });
      
      results.push({
        user,
        candidate,
        newCompany
      });
      
    } catch (error) {
      console.error(`✗ Error creating Company for ${user.email}:`, error.message);
      migrationLog.errors.push({
        userId: user._id.toString(),
        email: user.email,
        candidateId: candidate._id.toString(),
        error: error.message,
        step: 'createCompany',
        timestamp: new Date().toISOString()
      });
      // Continue with other records
    }
  }
  
  return results;
}

/**
 * STEP 4: Cleanup - Remove wrong Candidate documents
 */
async function cleanupWrongCandidates(successfulMigrations) {
  console.log('\n=== STEP 4: CLEANUP - REMOVING WRONG CANDIDATE RECORDS ===');
  
  for (const { candidate, user } of successfulMigrations) {
    try {
      await Candidate.deleteOne({ _id: candidate._id });
      console.log(`✓ Removed wrong Candidate record for ${user.email}`);
    } catch (error) {
      console.error(`✗ Error removing Candidate ${candidate._id}:`, error.message);
      migrationLog.errors.push({
        userId: user._id.toString(),
        email: user.email,
        candidateId: candidate._id.toString(),
        error: error.message,
        step: 'cleanup',
        timestamp: new Date().toISOString()
      });
    }
  }
}

/**
 * STEP 5: Save migration log
 */
async function saveMigrationLog() {
  migrationLog.endTime = new Date().toISOString();
  fs.writeFileSync(LOG_FILE, JSON.stringify(migrationLog, null, 2));
  console.log(`\n✓ Migration log saved to: ${LOG_FILE}`);
}

/**
 * Display migration summary
 */
function displaySummary() {
  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Records Processed: ${migrationLog.totalProcessed}`);
  console.log(`Successful Migrations: ${migrationLog.successfulMigrations}`);
  console.log(`Errors: ${migrationLog.errors.length}`);
  console.log(`Backup Location: ${BACKUP_FILE}`);
  console.log(`Log Location: ${LOG_FILE}`);
  console.log('='.repeat(60));
  
  if (migrationLog.errors.length > 0) {
    console.log('\n⚠ ERRORS ENCOUNTERED:');
    migrationLog.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err.email || 'Unknown'}: ${err.error}`);
    });
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('\n' + '='.repeat(60));
  console.log('RECRUITER TO COMPANY MIGRATION SCRIPT');
  console.log('Safe One-Time Data Migration');
  console.log('='.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    // Initialize backup directory
    initBackupDir();
    
    // STEP 1: Identify wrong records
    const wrongRecords = await identifyWrongRecords();
    
    if (wrongRecords.length === 0) {
      console.log('\n✓ No records to migrate. Exiting.');
      await mongoose.disconnect();
      return;
    }
    
    // STEP 2: Backup
    await backupRecords(wrongRecords);
    
    // Confirmation prompt
    console.log(`\n⚠ About to migrate ${wrongRecords.length} records.`);
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // STEP 3: Create Company documents
    const successfulMigrations = await createCompanyDocuments(wrongRecords);
    
    // STEP 4: Cleanup
    if (successfulMigrations.length > 0) {
      await cleanupWrongCandidates(successfulMigrations);
    }
    
    // STEP 5: Save log
    await saveMigrationLog();
    
    // Display summary
    displaySummary();
    
    console.log('\n✓ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    migrationLog.errors.push({
      step: 'main',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    await saveMigrationLog();
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Run migration if executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('\nMigration script finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nFatal error:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
