#!/bin/bash

# Profile Completion System - Integration Helper Script
# This script helps locate the files that need to be updated

echo "====================================================================="
echo "PROFILE COMPLETION SYSTEM - INTEGRATION HELPER"
echo "====================================================================="

SERVER_DIR="./server"
CLIENT_DIR="./client"

echo ""
echo "1. LOCATING CANDIDATE CONTROLLER..."
find $SERVER_DIR -type f -name "*candidate*controller*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Add: const { calculateCandidateProfileCompletion } = require('../utils/profileCompletion');"
    echo "   → Update getProfile and updateProfile to include profileCompletion"
    echo ""
done

echo "2. LOCATING COMPANY CONTROLLER..."
find $SERVER_DIR -type f -name "*company*controller*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Add: const { calculateCompanyProfileCompletion } = require('../utils/profileCompletion');"
    echo "   → Update getProfile and updateProfile to include profileCompletion"
    echo ""
done

echo "3. LOCATING APPLICATION ROUTES..."
find $SERVER_DIR -type f -name "*application*route*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Add: const { requireCandidateProfileComplete } = require('../middleware/profileCompletionGuard');"
    echo "   → Add middleware to apply route"
    echo ""
done

echo "4. LOCATING JOB ROUTES..."
find $SERVER_DIR -type f -name "*job*route*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Add: const { requireCompanyProfileComplete } = require('../middleware/profileCompletionGuard');"
    echo "   → Add middleware to create/post job route"
    echo ""
done

echo "5. LOCATING CANDIDATE PROFILE PAGE..."
find $CLIENT_DIR -type f -name "*CandidateProfile*.jsx" -o -name "*CandidateProfile*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Import ProfileCompletionBar component"
    echo "   → Import profileCompletionHelper utilities"
    echo "   → Add progress bar to profile overview"
    echo ""
done

echo "6. LOCATING COMPANY PROFILE PAGE..."
find $CLIENT_DIR -type f -name "*CompanyProfile*.jsx" -o -name "*CompanyProfile*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Import ProfileCompletionBar component"
    echo "   → Import profileCompletionHelper utilities"
    echo "   → Add progress bar to profile overview"
    echo ""
done

echo "7. LOCATING JOB DETAIL PAGE..."
find $CLIENT_DIR -type f -name "*JobDetail*.jsx" -o -name "*JobDetail*.js" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Import canApplyForJob from profileCompletionHelper"
    echo "   → Add validation before applying"
    echo "   → Disable apply button based on validation"
    echo ""
done

echo "8. LOCATING POST JOB PAGE..."
find $CLIENT_DIR -type f -name "*PostJob*.jsx" -o -name "*PostJob*.js" -o -name "*CreateJob*.jsx" 2>/dev/null | while read file; do
    echo "   Found: $file"
    echo "   → Import canPostJob from profileCompletionHelper"
    echo "   → Add validation before posting"
    echo ""
done

echo ""
echo "====================================================================="
echo "CREATED FILES (READY TO USE):"
echo "====================================================================="
echo "✓ server/utils/profileCompletion.js"
echo "✓ server/middleware/profileCompletionGuard.js"
echo "✓ client/src/components/common/ProfileCompletionBar.jsx"
echo "✓ client/src/utils/profileCompletionHelper.js"
echo "✓ PROFILE_COMPLETION_IMPLEMENTATION_GUIDE.md"
echo ""
echo "Next: Follow the integration guide to update your existing files"
echo "====================================================================="
