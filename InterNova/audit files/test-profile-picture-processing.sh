#!/bin/bash

# Profile Picture Processing Test Script
# Tests that all uploaded profile pictures are properly resized to 33x33px

echo "🧪 Testing Profile Picture Processing System"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:5000/api"
UPLOAD_DIR="/home/khan/Downloads/InterNova/server/uploads/profile-pics"

# Test results
PASSED=0
FAILED=0

# Function to check if sharp is installed
check_sharp() {
  echo "📦 Checking sharp installation..."
  if cd /home/khan/Downloads/InterNova/server && npm list sharp &> /dev/null; then
    echo -e "${GREEN}✓ sharp is installed${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ sharp is NOT installed${NC}"
    echo "Run: cd server && npm install sharp"
    ((FAILED++))
    return 1
  fi
  echo ""
}

# Function to check if imageProcessor.js exists
check_image_processor() {
  echo "🔍 Checking imageProcessor.js..."
  if [ -f "/home/khan/Downloads/InterNova/server/utils/imageProcessor.js" ]; then
    echo -e "${GREEN}✓ imageProcessor.js exists${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ imageProcessor.js NOT found${NC}"
    ((FAILED++))
    return 1
  fi
  echo ""
}

# Function to check middleware integration
check_middleware() {
  echo "🔍 Checking middleware integration..."
  if grep -q "processProfileImage" /home/khan/Downloads/InterNova/server/middlewares/profileUpload.js; then
    echo -e "${GREEN}✓ processProfileImage middleware exists${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ processProfileImage middleware NOT found${NC}"
    ((FAILED++))
  fi
  
  if grep -q "processProfileImage" /home/khan/Downloads/InterNova/server/routes/authRoutes.js; then
    echo -e "${GREEN}✓ processProfileImage used in routes${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ processProfileImage NOT used in routes${NC}"
    ((FAILED++))
  fi
  echo ""
}

# Function to check frontend img attributes
check_frontend() {
  echo "🔍 Checking frontend image attributes..."
  
  if grep -q 'width="33"' /home/khan/Downloads/InterNova/client/src/components/navbar/ProfileMenu.jsx; then
    echo -e "${GREEN}✓ ProfileMenu has 33px width${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ ProfileMenu missing 33px width${NC}"
    ((FAILED++))
  fi
  
  if grep -q 'height="33"' /home/khan/Downloads/InterNova/client/src/components/navbar/ProfileMenu.jsx; then
    echo -e "${GREEN}✓ ProfileMenu has 33px height${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ ProfileMenu missing 33px height${NC}"
    ((FAILED++))
  fi
  
  if grep -q 'width="33"' /home/khan/Downloads/InterNova/client/src/components/layout/Navbar.jsx; then
    echo -e "${GREEN}✓ Navbar has 33px width${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ Navbar missing 33px width${NC}"
    ((FAILED++))
  fi
  
  if grep -q 'height="33"' /home/khan/Downloads/InterNova/client/src/components/layout/Navbar.jsx; then
    echo -e "${GREEN}✓ Navbar has 33px height${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ Navbar missing 33px height${NC}"
    ((FAILED++))
  fi
  echo ""
}

# Function to check upload directory
check_upload_dir() {
  echo "📁 Checking upload directory..."
  if [ -d "$UPLOAD_DIR" ]; then
    echo -e "${GREEN}✓ Upload directory exists${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠ Upload directory doesn't exist yet (will be created on first upload)${NC}"
  fi
  echo ""
}

# Function to validate image dimensions (requires imagemagick)
validate_image_dimensions() {
  if command -v identify &> /dev/null; then
    echo "🖼️  Checking existing profile pictures..."
    if [ -d "$UPLOAD_DIR" ] && [ "$(ls -A $UPLOAD_DIR 2>/dev/null)" ]; then
      for img in "$UPLOAD_DIR"/*processed.jpg; do
        if [ -f "$img" ]; then
          dimensions=$(identify -format "%wx%h" "$img" 2>/dev/null)
          if [ "$dimensions" = "33x33" ]; then
            echo -e "${GREEN}✓ $(basename $img): $dimensions${NC}"
            ((PASSED++))
          else
            echo -e "${RED}✗ $(basename $img): $dimensions (expected 33x33)${NC}"
            ((FAILED++))
          fi
        fi
      done
    else
      echo -e "${YELLOW}⚠ No processed images found yet${NC}"
    fi
    echo ""
  else
    echo -e "${YELLOW}⚠ imagemagick not installed - skipping dimension validation${NC}"
    echo "Install: sudo apt install imagemagick"
    echo ""
  fi
}

# Function to test server is running
check_server() {
  echo "🌐 Checking if server is running..."
  if curl -s "$API_URL/auth/me" -o /dev/null -w "%{http_code}" | grep -q "40[01]"; then
    echo -e "${GREEN}✓ Server is responding${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠ Server might not be running${NC}"
    echo "Start server: cd server && npm run dev"
  fi
  echo ""
}

# Run all tests
check_sharp
check_image_processor
check_middleware
check_frontend
check_upload_dir
validate_image_dimensions
check_server

# Summary
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  echo ""
  echo "📝 Next Steps:"
  echo "1. Start the server: cd server && npm run dev"
  echo "2. Start the client: cd client && npm run dev"
  echo "3. Register a new user with a profile picture"
  echo "4. Verify the Navbar shows a properly sized profile image"
  echo "5. Check $UPLOAD_DIR for *-processed.jpg files"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
  exit 1
fi
