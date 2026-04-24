/**
 * Environment Configuration Validator
 * Validates critical environment variables and settings
 */

const chalk = require('chalk');

const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'MONGODB_URI',
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT',
  'CLIENT_URL',
];

/**
 * Validate environment configuration
 */
function validateEnv() {
  const errors = [];
  const warnings = [];

  console.log('\n🔍 Validating environment configuration...\n');

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    } else {
      console.log(chalk.green('✓'), varName, '=', chalk.gray('[SET]'));
    }
  });

  // Check optional variables
  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`Optional environment variable not set: ${varName}`);
      console.log(chalk.yellow('⚠'), varName, '=', chalk.gray('[NOT SET - using default]'));
    } else {
      console.log(chalk.green('✓'), varName, '=', chalk.gray(process.env[varName]));
    }
  });

  // Security checks
  if (process.env.JWT_SECRET === 'secret' || process.env.JWT_SECRET?.length < 32) {
    warnings.push('JWT_SECRET should be a strong, random string (32+ characters)');
  }

  if (process.env.JWT_REFRESH_SECRET === 'refresh_secret' || process.env.JWT_REFRESH_SECRET?.length < 32) {
    warnings.push('JWT_REFRESH_SECRET should be a strong, random string (32+ characters)');
  }

  if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL?.includes('localhost')) {
    warnings.push('CLIENT_URL should not use localhost in production');
  }

  // Print results
  console.log('');
  
  if (warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  WARNINGS:'));
    warnings.forEach(warning => console.log(chalk.yellow('  -'), warning));
  }

  if (errors.length > 0) {
    console.log(chalk.red('\n❌ ERRORS:'));
    errors.forEach(error => console.log(chalk.red('  -'), error));
    console.log(chalk.red('\n💥 Configuration validation failed!\n'));
    process.exit(1);
  }

  console.log(chalk.green('\n✅ Environment configuration is valid!\n'));
  return true;
}

// Run validation if executed directly
if (require.main === module) {
  require('dotenv').config();
  validateEnv();
}

module.exports = { validateEnv };
