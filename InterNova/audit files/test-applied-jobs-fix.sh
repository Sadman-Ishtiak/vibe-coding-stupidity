#!/bin/bash

# Test Applied Jobs Company Name Display Fix
# This script tests the fix for company names showing inconsistently in applied jobs

BASE_URL="http://localhost:3000/api"
CANDIDATE_EMAIL="anika@example.com"
CANDIDATE_PASSWORD="SecurePass123"

echo "========================================"
echo "Applied Jobs Company Name Display Test"
echo "========================================"
echo ""

# 1. Login as candidate
echo "1. Logging in as candidate..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$CANDIDATE_EMAIL\",
    \"password\": \"$CANDIDATE_PASSWORD\"
  }")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo ""

# 2. Get applied jobs
echo "2. Fetching applied jobs..."
APPLICATIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/applications/my" \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo "Applied Jobs Response:"
echo "====================="
echo $APPLICATIONS_RESPONSE | jq '.'
echo ""

# 3. Check if all applications have company names
echo "3. Checking company names..."
TOTAL=$(echo $APPLICATIONS_RESPONSE | jq '.data | length')
MISSING_COMPANY=$(echo $APPLICATIONS_RESPONSE | jq '[.data[] | select(.company == "N/A" or .companyName == "N/A")] | length')

echo "Total applications: $TOTAL"
echo "Applications missing company name: $MISSING_COMPANY"
echo ""

if [ "$MISSING_COMPANY" -eq 0 ]; then
  echo "✅ SUCCESS: All applications have company names!"
else
  echo "⚠️  WARNING: $MISSING_COMPANY applications missing company names"
  echo ""
  echo "Applications missing company names:"
  echo $APPLICATIONS_RESPONSE | jq '[.data[] | select(.company == "N/A" or .companyName == "N/A")] | .[] | {jobTitle, company, companyName}'
fi

echo ""
echo "========================================"
echo "Test Complete"
echo "========================================"
