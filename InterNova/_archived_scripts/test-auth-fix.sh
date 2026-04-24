#!/bin/bash

# AUTH FIX VALIDATION SCRIPT
# Purpose: Test the authentication system to ensure proper separation of Candidate and Company accounts
# Usage: bash scripts/test-auth-fix.sh

echo "🧪 AUTH FIX VALIDATION TESTS"
echo "============================"
echo ""

# Configuration
API_URL="http://localhost:5000/api/auth"
MONGO_DB="internova"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper function to run MongoDB query
run_mongo_query() {
  mongo $MONGO_DB --quiet --eval "$1"
}

# Helper function to print test result
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC} - $2"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} - $2"
    ((FAILED++))
  fi
}

echo "📋 PRE-DEPLOYMENT TESTS"
echo "----------------------"
echo ""

# TEST 1: Check for misplaced accounts
echo "Test 1: Checking for misplaced Company/Recruiter accounts in User collection..."
MISPLACED=$(run_mongo_query "db.users.find({ role: { \$in: ['company', 'recruiter'] } }).count()")
if [ "$MISPLACED" -eq 0 ]; then
  print_result 0 "No misplaced accounts found in users collection"
else
  print_result 1 "Found $MISPLACED misplaced account(s) - run cleanup script!"
fi
echo ""

# TEST 2: Verify collections exist
echo "Test 2: Verifying MongoDB collections exist..."
USERS_EXIST=$(run_mongo_query "db.getCollectionNames().includes('users')")
COMPANIES_EXIST=$(run_mongo_query "db.getCollectionNames().includes('companies')")

if [ "$USERS_EXIST" == "true" ] && [ "$COMPANIES_EXIST" == "true" ]; then
  print_result 0 "Both users and companies collections exist"
else
  print_result 1 "Missing collections"
fi
echo ""

echo "📊 CURRENT DATABASE STATE"
echo "------------------------"
CANDIDATE_COUNT=$(run_mongo_query "db.users.find({ role: 'candidate' }).count()")
COMPANY_COUNT=$(run_mongo_query "db.companies.find({ role: { \$in: ['company', 'recruiter'] } }).count()")
echo "Candidates in users collection: $CANDIDATE_COUNT"
echo "Companies in companies collection: $COMPANY_COUNT"
echo ""

echo "🔧 FUNCTIONAL TESTS"
echo "------------------"
echo ""

# Generate random email to avoid conflicts
RANDOM_ID=$(date +%s)
CANDIDATE_EMAIL="candidate${RANDOM_ID}@test.com"
COMPANY_EMAIL="company${RANDOM_ID}@test.com"
RECRUITER_EMAIL="recruiter${RANDOM_ID}@test.com"
PASSWORD="Test1234!"

# TEST 3: Candidate Signup
echo "Test 3: Testing candidate signup..."
RESPONSE=$(curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Test Candidate\",\"email\":\"$CANDIDATE_EMAIL\",\"password\":\"$PASSWORD\",\"accountType\":\"candidate\"}")

if echo "$RESPONSE" | grep -q "success.*true"; then
  # Verify in database
  CANDIDATE_IN_USERS=$(run_mongo_query "db.users.findOne({ email: '$CANDIDATE_EMAIL' }) ? 1 : 0")
  CANDIDATE_IN_COMPANIES=$(run_mongo_query "db.companies.findOne({ email: '$CANDIDATE_EMAIL' }) ? 1 : 0")
  
  if [ "$CANDIDATE_IN_USERS" == "1" ] && [ "$CANDIDATE_IN_COMPANIES" == "0" ]; then
    print_result 0 "Candidate saved to users collection (not companies)"
    
    # Check userType in token
    if echo "$RESPONSE" | grep -q "userType.*candidate"; then
      print_result 0 "Candidate token contains userType: 'candidate'"
    else
      print_result 1 "Candidate token missing userType field"
    fi
  else
    print_result 1 "Candidate saved to wrong collection"
  fi
else
  print_result 1 "Candidate signup failed"
fi
echo ""

# TEST 4: Company Signup
echo "Test 4: Testing company signup..."
RESPONSE=$(curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Test Company\",\"email\":\"$COMPANY_EMAIL\",\"password\":\"$PASSWORD\",\"accountType\":\"company\"}")

if echo "$RESPONSE" | grep -q "success.*true"; then
  # Verify in database
  COMPANY_IN_USERS=$(run_mongo_query "db.users.findOne({ email: '$COMPANY_EMAIL' }) ? 1 : 0")
  COMPANY_IN_COMPANIES=$(run_mongo_query "db.companies.findOne({ email: '$COMPANY_EMAIL' }) ? 1 : 0")
  
  if [ "$COMPANY_IN_COMPANIES" == "1" ] && [ "$COMPANY_IN_USERS" == "0" ]; then
    print_result 0 "Company saved to companies collection (not users)"
    
    # Check userType in token
    if echo "$RESPONSE" | grep -q "userType.*company"; then
      print_result 0 "Company token contains userType: 'company'"
    else
      print_result 1 "Company token missing userType field"
    fi
  else
    print_result 1 "Company saved to wrong collection"
  fi
else
  print_result 1 "Company signup failed"
fi
echo ""

# TEST 5: Recruiter Signup
echo "Test 5: Testing recruiter signup..."
RESPONSE=$(curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Test Recruiter\",\"email\":\"$RECRUITER_EMAIL\",\"password\":\"$PASSWORD\",\"accountType\":\"recruiter\"}")

if echo "$RESPONSE" | grep -q "success.*true"; then
  # Verify in database
  RECRUITER_IN_USERS=$(run_mongo_query "db.users.findOne({ email: '$RECRUITER_EMAIL' }) ? 1 : 0")
  RECRUITER_IN_COMPANIES=$(run_mongo_query "db.companies.findOne({ email: '$RECRUITER_EMAIL' }) ? 1 : 0")
  
  if [ "$RECRUITER_IN_COMPANIES" == "1" ] && [ "$RECRUITER_IN_USERS" == "0" ]; then
    print_result 0 "Recruiter saved to companies collection (not users)"
    
    # Check role field
    RECRUITER_ROLE=$(run_mongo_query "db.companies.findOne({ email: '$RECRUITER_EMAIL' }).role")
    if [ "$RECRUITER_ROLE" == "recruiter" ]; then
      print_result 0 "Recruiter has correct role field"
    else
      print_result 1 "Recruiter role incorrect"
    fi
  else
    print_result 1 "Recruiter saved to wrong collection"
  fi
else
  print_result 1 "Recruiter signup failed"
fi
echo ""

# TEST 6: Candidate Login
echo "Test 6: Testing candidate login..."
RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CANDIDATE_EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$RESPONSE" | grep -q "success.*true"; then
  if echo "$RESPONSE" | grep -q "userType.*candidate"; then
    print_result 0 "Candidate login successful with correct userType"
  else
    print_result 1 "Candidate login missing userType"
  fi
else
  print_result 1 "Candidate login failed"
fi
echo ""

# TEST 7: Company Login
echo "Test 7: Testing company login..."
RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$COMPANY_EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$RESPONSE" | grep -q "success.*true"; then
  if echo "$RESPONSE" | grep -q "userType.*company"; then
    print_result 0 "Company login successful with correct userType"
    
    # Extract token for further tests
    COMPANY_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
  else
    print_result 1 "Company login missing userType"
  fi
else
  print_result 1 "Company login failed"
fi
echo ""

# TEST 8: Token Validation
if [ ! -z "$COMPANY_TOKEN" ]; then
  echo "Test 8: Testing auth middleware with company token..."
  RESPONSE=$(curl -s -X GET "$API_URL/me" \
    -H "Authorization: Bearer $COMPANY_TOKEN")
  
  if echo "$RESPONSE" | grep -q "success.*true"; then
    print_result 0 "Auth middleware correctly loads company data"
  else
    print_result 1 "Auth middleware failed to load company data"
  fi
else
  print_result 1 "Skipping token validation (no token available)"
fi
echo ""

# TEST 9: Field Validation
echo "Test 9: Verifying no candidate-specific fields in company documents..."
COMPANY_DOC=$(run_mongo_query "db.companies.findOne({ email: '$COMPANY_EMAIL' })")

if echo "$COMPANY_DOC" | grep -q "skills\|education\|resume\|projects"; then
  print_result 1 "Company document contains candidate-specific fields!"
else
  print_result 0 "Company document is clean (no candidate fields)"
fi
echo ""

# CLEANUP TEST DATA
echo "🧹 CLEANUP"
echo "---------"
echo "Removing test accounts..."

run_mongo_query "db.users.deleteOne({ email: '$CANDIDATE_EMAIL' })" > /dev/null
run_mongo_query "db.companies.deleteOne({ email: '$COMPANY_EMAIL' })" > /dev/null
run_mongo_query "db.companies.deleteOne({ email: '$RECRUITER_EMAIL' })" > /dev/null

echo "Test accounts removed"
echo ""

# FINAL SUMMARY
echo "================================"
echo "📊 TEST SUMMARY"
echo "================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo "Auth system is working correctly."
  exit 0
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  echo "Please review the failed tests above."
  exit 1
fi
