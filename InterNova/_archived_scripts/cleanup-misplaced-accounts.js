/**
 * DATABASE CLEANUP SCRIPT
 * 
 * Purpose: Identify and remove Company/Recruiter accounts that were 
 * incorrectly saved to the User collection before the auth fix.
 * 
 * SAFETY FEATURES:
 * - DRY RUN mode by default (no actual deletions)
 * - Detailed reporting of what will be removed
 * - Backup data export before deletion
 * - Manual confirmation required for actual deletion
 * 
 * USAGE:
 * node scripts/cleanup-misplaced-accounts.js --dry-run  (Preview only)
 * node scripts/cleanup-misplaced-accounts.js --execute  (Actually delete)
 * node scripts/cleanup-misplaced-accounts.js --backup   (Export misplaced records)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('../server/models/User');
const Company = require('../server/models/Company');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || !args.includes('--execute');
const shouldBackup = args.includes('--backup');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/internova', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Find misplaced accounts
const findMisplacedAccounts = async () => {
  try {
    // Find User records with role 'company' or 'recruiter'
    const misplacedAccounts = await User.find({
      role: { $in: ['company', 'recruiter'] }
    }).select('_id username email role createdAt');

    return misplacedAccounts;
  } catch (error) {
    console.error('❌ Error finding misplaced accounts:', error.message);
    return [];
  }
};

// Export misplaced accounts to JSON file
const backupMisplacedAccounts = async (accounts) => {
  try {
    const backupDir = path.join(__dirname, '../backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupFile = path.join(backupDir, `misplaced-accounts-${timestamp}.json`);

    // Get full account data
    const fullAccounts = await User.find({
      role: { $in: ['company', 'recruiter'] }
    });

    fs.writeFileSync(backupFile, JSON.stringify(fullAccounts, null, 2));
    
    console.log(`\n📦 Backup created: ${backupFile}`);
    console.log(`   Records backed up: ${fullAccounts.length}`);
    
    return backupFile;
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    return null;
  }
};

// Migrate misplaced accounts to Company collection
const migrateMisplacedAccounts = async (accounts) => {
  const migrated = [];
  const failed = [];

  for (const account of accounts) {
    try {
      // Get full account data
      const fullAccount = await User.findById(account._id);
      
      // Check if this email already exists in Company collection
      const existingCompany = await Company.findOne({ email: fullAccount.email });
      
      if (existingCompany) {
        console.log(`⚠️  Email ${fullAccount.email} already exists in Company collection - skipping migration`);
        failed.push({ account, reason: 'Email already exists in Company collection' });
        continue;
      }

      // Create Company record with available data
      const companyData = {
        companyName: fullAccount.username || 'Unknown Company',
        email: fullAccount.email,
        password: fullAccount.password, // Already hashed
        role: fullAccount.role,
        ownerName: '',
        phone: fullAccount.phone || '',
        logo: fullAccount.profilePicture || '',
        isActive: true,
        // Note: createdAt and updatedAt will be set by MongoDB
      };

      await Company.create(companyData);
      
      migrated.push(account);
      console.log(`✅ Migrated: ${fullAccount.email} (${fullAccount.role})`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${account.email}:`, error.message);
      failed.push({ account, reason: error.message });
    }
  }

  return { migrated, failed };
};

// Delete misplaced accounts from User collection
const deleteMisplacedAccounts = async (accounts) => {
  try {
    const accountIds = accounts.map(acc => acc._id);
    
    const result = await User.deleteMany({
      _id: { $in: accountIds }
    });

    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error deleting accounts:', error.message);
    return 0;
  }
};

// Main execution
const main = async () => {
  console.log('\n🔍 MISPLACED ACCOUNTS CLEANUP SCRIPT');
  console.log('====================================\n');

  if (isDryRun) {
    console.log('🛡️  MODE: DRY RUN (Preview only - no changes will be made)');
  } else {
    console.log('⚡ MODE: EXECUTE (Changes will be made!)');
  }

  console.log('');

  // Connect to database
  await connectDB();

  // Find misplaced accounts
  console.log('🔎 Searching for misplaced accounts...\n');
  const misplacedAccounts = await findMisplacedAccounts();

  if (misplacedAccounts.length === 0) {
    console.log('✅ No misplaced accounts found!');
    console.log('   All Company/Recruiter accounts are in the correct collection.\n');
    await mongoose.connection.close();
    process.exit(0);
  }

  // Display findings
  console.log(`\n⚠️  Found ${misplacedAccounts.length} misplaced account(s) in User collection:\n`);
  
  misplacedAccounts.forEach((account, index) => {
    console.log(`${index + 1}. Email: ${account.email}`);
    console.log(`   Role: ${account.role}`);
    console.log(`   Username: ${account.username}`);
    console.log(`   Created: ${account.createdAt}`);
    console.log('');
  });

  // Backup if requested or if executing
  if (shouldBackup || !isDryRun) {
    await backupMisplacedAccounts(misplacedAccounts);
  }

  // Execute cleanup if not dry run
  if (!isDryRun) {
    console.log('\n🔄 Migrating accounts to Company collection...\n');
    
    const { migrated, failed } = await migrateMisplacedAccounts(misplacedAccounts);
    
    console.log(`\n✅ Successfully migrated: ${migrated.length}`);
    console.log(`❌ Failed to migrate: ${failed.length}\n`);
    
    if (migrated.length > 0) {
      console.log('🗑️  Removing migrated accounts from User collection...\n');
      const deletedCount = await deleteMisplacedAccounts(migrated);
      console.log(`✅ Deleted ${deletedCount} account(s) from User collection\n`);
    }
    
    if (failed.length > 0) {
      console.log('\n⚠️  Failed migrations:');
      failed.forEach((item, index) => {
        console.log(`${index + 1}. ${item.account.email} - ${item.reason}`);
      });
      console.log('');
    }
    
    console.log('\n✅ Cleanup complete!\n');
  } else {
    console.log('\n📋 DRY RUN SUMMARY:');
    console.log('==================');
    console.log(`   Accounts to migrate: ${misplacedAccounts.length}`);
    console.log('   Actions to be taken:');
    console.log('   1. Create records in Company collection');
    console.log('   2. Delete records from User collection');
    console.log('\n💡 To execute this cleanup, run:');
    console.log('   node scripts/cleanup-misplaced-accounts.js --execute\n');
    console.log('💡 To create a backup only:');
    console.log('   node scripts/cleanup-misplaced-accounts.js --backup\n');
  }

  // Close database connection
  await mongoose.connection.close();
  console.log('👋 Database connection closed\n');
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
