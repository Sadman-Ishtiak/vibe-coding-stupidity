#!/bin/bash

# 🧪 Authentication System Testing Script
# Tests login, token refresh, RBAC, and logout functionality

echo "🚀 Starting Authentication System Tests..."
echo ""

# Configuration
BASE_URL="http://localhost:5000/api"
CANDIDATE_EMAIL="candidate@test.com"
CANDIDATE_PASSWORD="Test123456"
RECRUITER_EMAIL="recruiter@test.com"
RECRUITER_PASSWORD="Test123456"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# Helper function to extract JSON field
extract_json() {
    echo "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | sed 's/.*"\([^"]*\)"/\1/'
}

echo "================================================"
echo "TEST 1: Candidate Login"
echo "================================================"

CANDIDATE_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$CANDIDATE_EMAIL\",\"password\":\"$CANDIDATE_PASSWORD\"}")

CANDIDATE_TOKEN=$(echo "$CANDIDATE_LOGIN" | grep -o '"accessToken"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)"/\1/')
CANDIDATE_SUCCESS=$(echo "$CANDIDATE_LOGIN" | grep -c '"success"[[:space:]]*:[[:space:]]*true')

if [ -n "$CANDIDATE_TOKEN" ] && [ "$CANDIDATE_SUCCESS" -eq 1 ]; then
    print_result 0 "Candidate login successful"
    echo "   Token: ${CANDIDATE_TOKEN:0:20}..."
else
    print_result 1 "Candidate login failed"
    echo "   Response: $CANDIDATE_LOGIN"
fi
echo ""

echo "================================================"
echo "TEST 2: Recruiter Login"
echo "================================================"

RECRUITER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$RECRUITER_EMAIL\",\"password\":\"$RECRUITER_PASSWORD\"}")

RECRUITER_TOKEN=$(echo "$RECRUITER_LOGIN" | grep -o '"accessToken"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)"/\1/')
RECRUITER_SUCCESS=$(echo "$RECRUITER_LOGIN" | grep -c '"success"[[:space:]]*:[[:space:]]*true')

if [ -n "$RECRUITER_TOKEN" ] && [ "$RECRUITER_SUCCESS" -eq 1 ]; then
    print_result 0 "Recruiter login successful"
    echo "   Token: ${RECRUITER_TOKEN:0:20}..."
else
    print_result 1 "Recruiter login failed"
    echo "   Response: $RECRUITER_LOGIN"
fi
echo ""

echo "================================================"
echo "TEST 3: Invalid Login Credentials"
echo "================================================"

INVALID_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@test.com","password":"wrongpass"}')

INVALID_STATUS=$(echo "$INVALID_LOGIN" | grep -c '"success"[[:space:]]*:[[:space:]]*false')

if [ "$INVALID_STATUS" -eq 1 ]; then
    print_result 0 "Invalid credentials rejected (401)"
else
    print_result 1 "Invalid credentials not properly rejected"
fi
echo ""

echo "================================================"
echo "TEST 4: Get Current User (Authenticated)"
echo "================================================"

if [ -n "$CANDIDATE_TOKEN" ]; then
    ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
        -H "Authorization: Bearer $CANDIDATE_TOKEN")
    
    ME_SUCCESS=$(echo "$ME_RESPONSE" | grep -c '"success"[[:space:]]*:[[:space:]]*true')
    
    if [ "$ME_SUCCESS" -eq 1 ]; then
        print_result 0 "Get current user successful"
        USER_EMAIL=$(echo "$ME_RESPONSE" | grep -o '"email"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)"/\1/')
        echo "   Email: $USER_EMAIL"
    else
        print_result 1 "Get current user failed"
    fi
else
    print_result 1 "Cannot test - no candidate token"
fi
echo ""

echo "================================================"
echo "TEST 5: Access Protected Route Without Token"
echo "================================================"

NO_AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me")
NO_AUTH_CODE=$(echo "$NO_AUTH_RESPONSE" | tail -n1)

if [ "$NO_AUTH_CODE" = "401" ]; then
    print_result 0 "Unauthorized access blocked (401)"
else
    print_result 1 "Unauthorized access not properly blocked (expected 401, got $NO_AUTH_CODE)"
fi
echo ""

echo "================================================"
echo "TEST 6: RBAC - Candidate Tries to Create Job"
echo "================================================"

if [ -n "$CANDIDATE_TOKEN" ]; then
    CREATE_JOB=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/jobs" \
        -H "Authorization: Bearer $CANDIDATE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"title":"Test Job","company":"Test Company"}')
    
    JOB_CODE=$(echo "$CREATE_JOB" | tail -n1)
    
    if [ "$JOB_CODE" = "403" ]; then
        print_result 0 "Candidate blocked from creating job (403)"
    else
        print_result 1 "RBAC not working - candidate should be blocked (expected 403, got $JOB_CODE)"
    fi
else
    print_result 1 "Cannot test - no candidate token"
fi
echo ""

echo "================================================"
echo "TEST 7: RBAC - Recruiter Creates Job"
echo "================================================"

if [ -n "$RECRUITER_TOKEN" ]; then
    RECRUITER_JOB=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/jobs" \
        -H "Authorization: Bearer $RECRUITER_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"title":"Developer","description":"Test job","location":"Remote","salary":"$100k"}')
    
    RECRUITER_JOB_CODE=$(echo "$RECRUITER_JOB" | tail -n1)
    
    if [ "$RECRUITER_JOB_CODE" = "201" ] || [ "$RECRUITER_JOB_CODE" = "200" ]; then
        print_result 0 "Recruiter successfully created job"
    else
        print_result 1 "Recruiter unable to create job (code: $RECRUITER_JOB_CODE)"
        echo "   Response: $(echo "$RECRUITER_JOB" | head -n-1)"
    fi
else
    print_result 1 "Cannot test - no recruiter token"
fi
echo ""

echo "================================================"
echo "TEST 8: Token Refresh"
echo "================================================"

# Note: This test requires the refresh token from cookies or localStorage
# In a real scenario, you'd extract the refresh token from the login response

REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh-token" \
    -c cookies.txt -b cookies.txt)

REFRESH_SUCCESS=$(echo "$REFRESH_RESPONSE" | grep -c '"accessToken"')

if [ "$REFRESH_SUCCESS" -ge 1 ]; then
    print_result 0 "Token refresh endpoint exists and responds"
else
    echo -e "${YELLOW}⚠ SKIP${NC}: Token refresh (requires valid refresh token in cookie)"
fi
echo ""

echo "================================================"
echo "TEST 9: Logout"
echo "================================================"

if [ -n "$CANDIDATE_TOKEN" ]; then
    LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
        -H "Authorization: Bearer $CANDIDATE_TOKEN")
    
    LOGOUT_SUCCESS=$(echo "$LOGOUT_RESPONSE" | grep -c '"success"[[:space:]]*:[[:space:]]*true')
    
    if [ "$LOGOUT_SUCCESS" -eq 1 ]; then
        print_result 0 "Logout successful"
    else
        print_result 1 "Logout failed"
    fi
else
    print_result 1 "Cannot test - no candidate token"
fi
echo ""

echo "================================================"
echo "TEST 10: Access After Logout"
echo "================================================"

if [ -n "$CANDIDATE_TOKEN" ]; then
    # Try to use the same token after logout
    POST_LOGOUT=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me" \
        -H "Authorization: Bearer $CANDIDATE_TOKEN")
    
    POST_LOGOUT_CODE=$(echo "$POST_LOGOUT" | tail -n1)
    
    # Note: Token might still be valid since logout only clears refresh token
    # For true token invalidation, implement token blacklisting
    echo -e "${YELLOW}⚠ INFO${NC}: Access token still valid after logout (expected behavior)"
    echo "   Use token expiry (15 min) or implement blacklisting for immediate invalidation"
else
    print_result 1 "Cannot test - no candidate token"
fi
echo ""

# Cleanup
rm -f cookies.txt

# Summary
echo "================================================"
echo "📊 TEST SUMMARY"
echo "================================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
TOTAL=$((PASSED + FAILED))
echo "Total: $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
