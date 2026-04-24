#!/bin/bash

# CANDIDATE PROFILE - QUICK TEST SCRIPT
# Run this to verify all fixes are working

echo "======================================"
echo "CANDIDATE PROFILE FIX - TEST SCRIPT"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}MANUAL TEST CHECKLIST${NC}"
echo ""

echo "1. PROFILE IMAGE UPLOAD"
echo "   ✓ Login as candidate"
echo "   ✓ Go to Profile > Settings tab"
echo "   ✓ Upload a profile image (JPEG/PNG/WEBP)"
echo "   ✓ Verify image appears immediately"
echo "   ✓ Switch to Overview tab - image should be visible"
echo "   ✓ Check Navbar - image should update there too"
echo ""

echo "2. RESUME UPLOAD"
echo "   ✓ Go to Settings > Documents section"
echo "   ✓ Upload a resume (PDF/DOC/DOCX)"
echo "   ✓ Verify success message"
echo "   ✓ Switch to Overview tab"
echo "   ✓ Check Documents section - resume should be listed"
echo "   ✓ Click download icon - should download correctly"
echo ""

echo "3. SOCIAL MEDIA"
echo "   ✓ Go to Overview tab"
echo "   ✓ Check social media icons - should NOT include phone"
echo "   ✓ Phone should only appear in Contacts section"
echo "   ✓ Go to Settings > Social Media"
echo "   ✓ Verify no Phone Call Link input exists"
echo ""

echo "4. PROFILE UPDATE"
echo "   ✓ Go to Settings tab"
echo "   ✓ Update firstName and lastName"
echo "   ✓ Update designation"
echo "   ✓ Update phone"
echo "   ✓ Update About section"
echo "   ✓ Click 'Update Profile'"
echo "   ✓ Verify success message (NOT failed)"
echo "   ✓ Refresh page - changes should persist"
echo "   ✓ Check Navbar - name should update immediately"
echo ""

echo "5. EMAIL IMMUTABILITY"
echo "   ✓ Go to Settings tab"
echo "   ✓ Try to change email field - should be disabled"
echo "   ✓ Verify helper text: 'Email cannot be changed'"
echo ""

echo "6. PROFILE CACHING"
echo "   ✓ Navigate to Profile page"
echo "   ✓ Open browser DevTools > Network tab"
echo "   ✓ Navigate away and back to Profile"
echo "   ✓ Verify NO new API call to /api/candidates/me"
echo "   ✓ Profile should load instantly from cache"
echo ""

echo "7. VALIDATION TESTS"
echo "   ✓ Try uploading image > 5MB - should be rejected"
echo "   ✓ Try uploading non-image as profile - should be rejected"
echo "   ✓ Try uploading non-document as resume - should be rejected"
echo "   ✓ Try updating profile with empty firstName - should fail"
echo ""

echo "8. IMAGE QUALITY"
echo "   ✓ Upload a large image (e.g., 4000x3000px)"
echo "   ✓ Verify it's resized to 200x200"
echo "   ✓ Verify image is sharp and centered"
echo "   ✓ Check file size - should be optimized (< 50KB typically)"
echo ""

echo ""
echo -e "${GREEN}======================================"
echo "EXPECTED RESULTS:"
echo "======================================"
echo "✅ Profile image uploads and displays everywhere"
echo "✅ Resume uploads and shows in Overview"
echo "✅ No phoneCall field in social media"
echo "✅ Profile updates show success messages"
echo "✅ Email field is disabled"
echo "✅ No repeated API calls on navigation"
echo "✅ All validations work correctly"
echo "✅ Old files deleted on replacement"
echo ""
echo -e "${YELLOW}API ENDPOINTS TO TEST:${NC}"
echo "GET    /api/candidates/me"
echo "PUT    /api/candidates/me"
echo "POST   /api/candidates/me/profile-image"
echo "POST   /api/candidates/me/resume"
echo "PUT    /api/candidates/change-password"
echo ""
echo -e "${GREEN}All tests should pass! 🚀${NC}"
