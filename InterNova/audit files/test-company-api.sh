#!/bin/bash

# Company Module API Test Script
# Tests all public company endpoints

BASE_URL="http://localhost:5000/api"
COMPANY_ID="" # Will be extracted from list response

echo "================================="
echo "COMPANY MODULE API TESTS"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    echo -e "${YELLOW}Testing:${NC} $name"
    echo "URL: $url"
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_status, got $http_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    echo "---------------------------------"
    echo ""
    
    # Extract company ID from first test for subsequent tests
    if [ -z "$COMPANY_ID" ] && [ "$http_code" = "200" ]; then
        COMPANY_ID=$(echo "$body" | jq -r '.data[0]._id' 2>/dev/null)
        if [ -n "$COMPANY_ID" ] && [ "$COMPANY_ID" != "null" ]; then
            echo -e "${GREEN}Extracted Company ID:${NC} $COMPANY_ID"
            echo ""
        fi
    fi
}

# 1. Test: Get Companies (Default)
test_endpoint \
    "Get Companies - Default" \
    "$BASE_URL/companies"

# 2. Test: Get Companies with Pagination
test_endpoint \
    "Get Companies - Page 1, Limit 5" \
    "$BASE_URL/companies?page=1&limit=5"

# 3. Test: Get Companies Sorted by Name (A-Z)
test_endpoint \
    "Get Companies - Sorted A-Z" \
    "$BASE_URL/companies?sortBy=companyName&order=asc"

# 4. Test: Get Companies Sorted by Date (Newest)
test_endpoint \
    "Get Companies - Sorted Newest" \
    "$BASE_URL/companies?sortBy=createdAt&order=desc"

# Check if we have a company ID to test details
if [ -n "$COMPANY_ID" ] && [ "$COMPANY_ID" != "null" ]; then
    # 5. Test: Get Company by ID
    test_endpoint \
        "Get Company by ID" \
        "$BASE_URL/companies/$COMPANY_ID"
    
    # 6. Test: Get Company Jobs
    test_endpoint \
        "Get Company Jobs" \
        "$BASE_URL/companies/$COMPANY_ID/jobs"
else
    echo -e "${YELLOW}⚠ WARNING:${NC} No company ID found, skipping detail tests"
    echo "Make sure you have companies in your database"
    echo ""
fi

# 7. Test: Invalid Company ID (should return 400)
test_endpoint \
    "Get Company - Invalid ID" \
    "$BASE_URL/companies/invalid-id" \
    400

# 8. Test: Non-existent Company ID (should return 404)
test_endpoint \
    "Get Company - Non-existent ID" \
    "$BASE_URL/companies/507f1f77bcf86cd799439011" \
    404

# Summary
echo "================================="
echo "TEST SUMMARY"
echo "================================="
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
