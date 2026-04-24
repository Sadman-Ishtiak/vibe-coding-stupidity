const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');

const testEmail = 'smoketest' + Date.now() + '@example.com';
const testPassword = 'Test123456';
const testUsername = 'Test Company ' + Date.now();

console.log('\n=== SMOKE TEST: Company Authentication Flow ===\n');
console.log('Test Email:', testEmail);
console.log('Test Password:', testPassword);

async function runTest() {
  try {
    console.log('\n--- Step 1: Register Company ---');
    
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        email: testEmail,
        password: testPassword,
        accountType: 'company'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('Registration Response:', JSON.stringify(registerData, null, 2));
    
    if (!registerData.success) {
      console.log('\n❌ REGISTRATION FAILED');
      process.exit(1);
    }
    
    console.log('\n✅ Registration successful');
    console.log('\n--- Step 2: Check User in Database ---');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internova');
    
    const user = await User.findOne({ email: testEmail });
    if (!user) {
      console.log('❌ User not found in database');
      process.exit(1);
    }
    
    console.log('\nUser found in DB:');
    console.log('- ID:', user._id);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- isEmailVerified:', user.isEmailVerified);
    console.log('- isVerified:', user.isVerified);
    console.log('- Has OTP:', !!user.emailOTP);
    console.log('- OTP Purpose:', user.emailOTPPurpose);
    
    if (user.role !== 'recruiter') {
      console.log('\n❌ CRITICAL: User role is', user.role, 'instead of recruiter');
      process.exit(1);
    }
    
    console.log('\n✅ User role correctly set to recruiter');
    
    // Check Company profile
    const company = await Company.findOne({ userId: user._id });
    if (!company) {
      console.log('❌ Company profile not found');
      process.exit(1);
    }
    
    console.log('\nCompany profile found:');
    console.log('- ID:', company._id);
    console.log('- Company Name:', company.companyName);
    console.log('- isActive:', company.isActive);
    
    console.log('\n--- Step 3: Simulate OTP Verification ---');
    user.isEmailVerified = true;
    user.isVerified = true;
    user.emailOTP = null;
    user.emailOTPExpires = null;
    user.emailOTPPurpose = null;
    
    await user.save();
    
    console.log('User verified:');
    console.log('- isEmailVerified:', user.isEmailVerified);
    console.log('- isVerified:', user.isVerified);
    console.log('\n✅ Email verification successful');
    
    console.log('\n--- Step 4: Attempt Login ---');
    
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: testPassword
      })
    });
    
    const loginData = await loginRes.json();
    console.log('\nLogin Response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.success) {
      console.log('\n❌ LOGIN FAILED');
      console.log('Error:', loginData.message);
      
      // Debug: Re-fetch user to check state
      const userCheck = await User.findOne({ email: testEmail });
      console.log('\nUser state check:');
      console.log('- isEmailVerified:', userCheck.isEmailVerified);
      console.log('- isVerified:', userCheck.isVerified);
      console.log('- role:', userCheck.role);
      
      const companyCheck = await Company.findOne({ userId: userCheck._id });
      console.log('\nCompany state check:');
      console.log('- Found:', !!companyCheck);
      console.log('- isActive:', companyCheck?.isActive);
      
      await mongoose.connection.close();
      process.exit(1);
    }
    
    console.log('\n✅ LOGIN SUCCESSFUL!');
    console.log('- Access Token:', loginData.accessToken ? 'Generated ✓' : 'Missing ✗');
    console.log('- User Role:', loginData.user?.role);
    console.log('- User Type:', loginData.user?.userType);
    console.log('- Company Name:', loginData.user?.companyName);
    
    console.log('\n=== 🎉 SMOKE TEST PASSED ===\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err.stack);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

runTest();
