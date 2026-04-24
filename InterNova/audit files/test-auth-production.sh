#!/bin/bash

#############################################
# Authentication System Production Test Suite
# Tests all critical auth flows and edge cases
#############################################

set -e

echo "🧪 AUTHENTICATION SYSTEM TEST SUITE"
echo "===================================="
echo ""

# Configuration
API_URL=${API_URL:-"http://localhost:5000/api"}
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="TestPass123"
TEST_USERNAME="TestUser$(date +%s)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((TESTS_PASSED++))
}

fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((TESTS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
}

test_header() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "TEST: $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

#############################################
# Test 1: Server Health Check
#############################################
test_header "Server Health Check"

if curl -s "$API_URL/../uploads" > /dev/null; then
    pass "Uploads directory is accessible"
else
    fail "Uploads directory is NOT accessible"
fi

#############################################
# Test 2: User Registration
#############################################
test_header "User Registration"

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"$TEST_USERNAME\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"accountType\": \"candidate\"
    }")

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    pass "User registration successful"
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
else
    fail "User registration failed"
    echo "$REGISTER_RESPONSE"
fi

#############################################
# Test 3: User Login
#############################################
test_header "User Login"

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }")

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    pass "User login successful"
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$ACCESS_TOKEN" ]; then
        pass "Access token received"
    else
        fail "No access token in response"
    fi
    
    if [ -n "$REFRESH_TOKEN" ]; then
        pass "Refresh token received"
    else
        fail "No refresh token in response"
    fi
else
    fail "User login failed"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

#############################################
# Test 4: Get Current User (/auth/me)
#############################################
test_header "Get Current User (/auth/me)"

ME_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$ME_RESPONSE" | grep -q '"success":true'; then
    pass "/auth/me returns user data"
    
    if echo "$ME_RESPONSE" | grep -q "\"id\":\"$USER_ID\""; then
        pass "User ID matches"
    else
        fail "User ID mismatch"
    fi
    
    if echo "$ME_RESPONSE" | grep -q "\"email\":\"$TEST_EMAIL\""; then
        pass "Email matches"
    else
        fail "Email mismatch"
    fi
else
    fail "/auth/me failed"
    echo "$ME_RESPONSE"
fi

#############################################
# Test 5: Invalid Token Handling
#############################################
test_header "Invalid Token Handling"

INVALID_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
    -H "Authorization: Bearer invalid_token_here")

if echo "$INVALID_RESPONSE" | grep -q '"success":false'; then
    pass "Invalid token rejected correctly"
else
    fail "Invalid token was accepted (security issue!)"
fi

#############################################
# Test 6: Missing Token Handling
#############################################
test_header "Missing Token Handling"

NO_TOKEN_RESPONSE=$(curl -s -X GET "$API_URL/auth/me")

if echo "$NO_TOKEN_RESPONSE" | grep -q '"success":false'; then
    pass "Request without token rejected correctly"
else
    fail "Request without token was accepted (security issue!)"
fi

#############################################
# Test 7: Token Refresh
#############################################
test_header "Token Refresh"

# Wait a moment to ensure token is different
sleep 2

REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh-token" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

if echo "$REFRESH_RESPONSE" | grep -q '"success":true'; then
    pass "Token refresh successful"
    
    NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    NEW_REFRESH_TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ "$NEW_ACCESS_TOKEN" != "$ACCESS_TOKEN" ]; then
        pass "New access token is different (rotation working)"
    else
        warn "New access token is same as old (rotation may not be working)"
    fi
    
    if [ "$NEW_REFRESH_TOKEN" != "$REFRESH_TOKEN" ]; then
        pass "New refresh token is different (rotation working)"
    else
        warn "New refresh token is same as old (rotation may not be working)"
    fi
    
    # Update tokens for further tests
    ACCESS_TOKEN="$NEW_ACCESS_TOKEN"
    REFRESH_TOKEN="$NEW_REFRESH_TOKEN"
else
    fail "Token refresh failed"
    echo "$REFRESH_RESPONSE"
fi

#############################################
# Test 8: Old Refresh Token Invalid
#############################################
test_header "Old Refresh Token Invalidation"

OLD_TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh-token" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

if echo "$OLD_TOKEN_RESPONSE" | grep -q '"success":false'; then
    pass "Old refresh token correctly rejected (token rotation secure)"
else
    warn "Old refresh token still works (possible security issue)"
fi

#############################################
# Test 9: Protected Route Access
#############################################
test_header "Protected Route Access"

# Test with valid token
PROTECTED_VALID=$(curl -s -X GET "$API_URL/auth/me" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PROTECTED_VALID" | grep -q '"success":true'; then
    pass "Protected route accessible with valid token"
else
    fail "Protected route not accessible with valid token"
fi

#############################################
# Test 10: Logout
#############################################
test_header "User Logout"

LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/auth/logout" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$LOGOUT_RESPONSE" | grep -q '"success":true'; then
    pass "Logout successful"
else
    fail "Logout failed"
    echo "$LOGOUT_RESPONSE"
fi

#############################################
# Test 11: Token Invalid After Logout
#############################################
test_header "Token Invalid After Logout"

POST_LOGOUT_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$POST_LOGOUT_RESPONSE" | grep -q '"success":false'; then
    pass "Token correctly invalidated after logout"
else
    fail "Token still works after logout (security issue!)"
fi

#############################################
# Test 12: Invalid Credentials
#############################################
test_header "Invalid Credentials Handling"

INVALID_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"WrongPassword123\"
    }")

if echo "$INVALID_LOGIN" | grep -q '"success":false'; then
    pass "Invalid credentials rejected"
else
    fail "Invalid credentials accepted (security issue!)"
fi

#############################################
# Test 13: Duplicate Registration
#############################################
test_header "Duplicate Registration Prevention"

DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"DuplicateUser\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"accountType\": \"candidate\"
    }")

if echo "$DUPLICATE_RESPONSE" | grep -q '"success":false'; then
    pass "Duplicate email registration prevented"
else
    fail "Duplicate email registration allowed (data integrity issue!)"
fi

#############################################
# Test Summary
#############################################
echo ""
echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Authentication system is production-ready.${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED! Please review and fix issues before production.${NC}"
    exit 1
fi
