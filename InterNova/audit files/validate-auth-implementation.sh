#!/bin/bash

#############################################
# Auth System Implementation Validator
# Verifies all hardening features are present
#############################################

echo "🔍 AUTHENTICATION SYSTEM VALIDATION"
echo "====================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECKS_PASSED=0
CHECKS_FAILED=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ((CHECKS_FAILED++))
        return 1
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $3"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo "📦 Checking New Files..."
echo "─────────────────────────"
check_file "client/src/utils/imageHelpers.js" "Image helpers utility"
check_file "client/src/utils/authLogger.js" "Frontend auth logger"
check_file "server/utils/authLogger.js" "Backend auth logger"
check_file "server/utils/validateEnv.js" "Environment validator"
check_file "client/src/components/common/ProfileImage.jsx" "ProfileImage component"
check_file "test-auth-production.sh" "Production test suite"
check_file "AUTH_PRODUCTION_AUDIT_REPORT.md" "Audit report"

echo ""
echo "🔧 Checking Frontend Implementation..."
echo "────────────────────────────────────"
check_content "client/src/context/AuthContext.jsx" "authLog" "Auth logging in AuthContext"
check_content "client/src/context/AuthContext.jsx" "getMe()" "/auth/me synchronization"
check_content "client/src/config/api.js" "authLog" "Auth logging in API interceptor"
check_content "client/src/config/api.js" "triggerLogout" "Logout event system"
check_content "client/src/services/auth.service.js" "authLog" "Auth logging in auth service"
check_content "client/src/components/layout/Navbar.jsx" "getProfileImageUrl" "Image normalization in Navbar"
check_content "client/src/components/layout/Navbar.jsx" "createImageErrorHandler" "Fallback handler in Navbar"
check_content "client/src/components/navbar/ProfileMenu.jsx" "getProfileImageUrl" "Image normalization in ProfileMenu"
check_content "client/src/components/navbar/ProfileMenu.jsx" "onError" "Fallback handler in ProfileMenu"

echo ""
echo "🔧 Checking Backend Implementation..."
echo "──────────────────────────────────"
check_content "server/controllers/authController.js" "authLog" "Auth logging in authController"
check_content "server/middlewares/authMiddleware.js" "authLog" "Auth logging in authMiddleware"
check_content "server/middlewares/roleMiddleware.js" "authLog" "Auth logging in roleMiddleware"
check_content "server/middlewares/authMiddleware.js" "TOKEN_EXPIRED" "Token expiry detection"
check_content "server/controllers/authController.js" "generateRefreshToken" "Refresh token generation"
check_content "server/controllers/authController.js" "refreshToken !==" "Token rotation validation"

echo ""
echo "🔒 Checking Security Features..."
echo "──────────────────────────────"
check_content "server/utils/generateToken.js" "expiresIn: '15m'" "Access token 15m expiry"
check_content "server/utils/generateToken.js" "expiresIn: '7d'" "Refresh token 7d expiry"
check_content "server/middlewares/authMiddleware.js" "TokenExpiredError" "Token expiry error handling"
check_content "client/src/config/api.js" "isRefreshing" "Token refresh queue"
check_content "client/src/config/api.js" "processQueue" "Request queue processing"
check_content "server/models/User.js" "refreshToken" "Refresh token storage in DB"
check_content "server/models/User.js" "refreshTokenExpiry" "Token expiry timestamp"

echo ""
echo "📝 Checking Documentation..."
echo "─────────────────────────"
check_file "AUTH_PRODUCTION_AUDIT_REPORT.md" "Production audit report"
check_file "test-auth-production.sh" "Test suite script"

echo ""
echo "=========================================="
echo "VALIDATION SUMMARY"
echo "=========================================="
echo -e "Total Checks: $((CHECKS_PASSED + CHECKS_FAILED))"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL IMPLEMENTATIONS VALIDATED!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review AUTH_PRODUCTION_AUDIT_REPORT.md"
    echo "2. Run: npm install (if needed)"
    echo "3. Run: ./test-auth-production.sh (with server running)"
    echo "4. Perform manual testing"
    exit 0
else
    echo -e "${RED}⚠️  SOME IMPLEMENTATIONS MISSING!${NC}"
    echo "Please review failed checks above."
    exit 1
fi
