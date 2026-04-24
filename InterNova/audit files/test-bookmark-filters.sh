#!/bin/bash

# Test Bookmark Jobs Filters Fix
# This script tests the fixed filters for bookmarked jobs

BASE_URL="http://localhost:3000/api"
CANDIDATE_EMAIL="anika@example.com"
CANDIDATE_PASSWORD="SecurePass123"

echo "========================================"
echo "Bookmark Jobs Filters Test"
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

# 2. Get bookmarked jobs
echo "2. Fetching bookmarked jobs..."
BOOKMARKS_RESPONSE=$(curl -s -X GET "$BASE_URL/candidates/bookmarks" \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo "Bookmarked Jobs Response:"
echo "========================="
echo $BOOKMARKS_RESPONSE | jq '.'
echo ""

# 3. Validate data structure
echo "3. Validating bookmark data structure..."
TOTAL=$(echo $BOOKMARKS_RESPONSE | jq '.data | length')
echo "Total bookmarks: $TOTAL"

if [ "$TOTAL" -gt 0 ]; then
  echo ""
  echo "Sample Bookmark Data:"
  echo $BOOKMARKS_RESPONSE | jq '.data[0] | {title, employmentType, location, company: .company.username, companyName}'
  echo ""
  
  # Check for required fields
  MISSING_EMPLOYMENT=$(echo $BOOKMARKS_RESPONSE | jq '[.data[] | select(.employmentType == null or .employmentType == "")] | length')
  MISSING_LOCATION=$(echo $BOOKMARKS_RESPONSE | jq '[.data[] | select(.location == null or .location == "")] | length')
  MISSING_COMPANY=$(echo $BOOKMARKS_RESPONSE | jq '[.data[] | select((.company.username == null or .company.username == "") and (.companyName == null or .companyName == ""))] | length')
  
  echo "Validation Results:"
  echo "- Missing employmentType: $MISSING_EMPLOYMENT"
  echo "- Missing location: $MISSING_LOCATION"
  echo "- Missing company info: $MISSING_COMPANY"
  echo ""
  
  if [ "$MISSING_EMPLOYMENT" -eq 0 ] && [ "$MISSING_LOCATION" -eq 0 ] && [ "$MISSING_COMPANY" -eq 0 ]; then
    echo "✅ SUCCESS: All bookmarks have required filter fields!"
  else
    echo "⚠️  WARNING: Some bookmarks missing filter fields"
  fi
else
  echo "⚠️  No bookmarks found. Please bookmark some jobs first."
fi

echo ""
echo "========================================"
echo "Frontend Filter Test Instructions:"
echo "========================================"
echo "1. Go to http://localhost:5173/bookmark-jobs"
echo "2. Test Keyword filter (search by job title or company)"
echo "3. Test Job Type filter (Full Time, Part Time, etc.)"
echo "4. Test Location filter (select from dropdown)"
echo "5. Verify results update correctly"
echo ""
echo "Expected Behavior:"
echo "- Keyword: Filters by job title and company name"
echo "- Job Type: Matches employmentType field"
echo "- Location: Filters by job location"
echo "- Clear button: Resets all filters"
echo ""
echo "Test Complete"
echo "========================================"
