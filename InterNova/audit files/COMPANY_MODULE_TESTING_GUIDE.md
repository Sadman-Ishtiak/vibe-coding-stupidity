# Company Module - Frontend Testing Guide

## 🎯 Manual Testing Checklist

### Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:5173` (or your Vite port)
- Database has at least 3-5 companies with jobs

---

## 📋 Test Scenarios

### 1. CompanyList Page (`/company-list`)

#### A. Initial Load
- [ ] Navigate to `/company-list`
- [ ] Loading spinner appears briefly
- [ ] Companies display in grid (3 columns on desktop)
- [ ] Each card shows: logo, company name, location, job count
- [ ] "Showing X-Y of Z results" displays correct numbers

#### B. Pagination
- [ ] If total > 12 companies, pagination appears at bottom
- [ ] Page 1 is highlighted/active
- [ ] Click page 2 → URL changes to `?page=2`
- [ ] Company list updates without page reload
- [ ] Page scrolls to top smoothly
- [ ] Previous button disabled on page 1
- [ ] Next button disabled on last page
- [ ] Page numbers center around current page

#### C. Sorting
- [ ] Sort dropdown shows "Default" initially
- [ ] Select "Newest" → URL changes to `?sortBy=createdAt&order=desc`
- [ ] Companies reorder (newest first)
- [ ] Page resets to 1
- [ ] Select "Oldest" → Companies reorder (oldest first)
- [ ] Select "A-Z" → Companies sort alphabetically
- [ ] Select "Z-A" → Companies sort reverse alphabetically
- [ ] Job count updates correctly after sort

#### D. Navigation
- [ ] Click company name → navigates to `/company-details/:id`
- [ ] Click job count button → navigates to `/company-details/:id`
- [ ] No page reload (React Router navigation)
- [ ] Browser back button works

#### E. Edge Cases
- [ ] Empty database → Shows "No companies found"
- [ ] API error → Shows empty state gracefully
- [ ] Image missing → Shows fallback image
- [ ] Invalid page number in URL → Falls back to page 1

---

### 2. CompanyCard Component

#### A. Visual Elements
- [ ] Logo displays (or fallback if missing)
- [ ] Company name in bold, large font
- [ ] Location in muted text
- [ ] Job count button with proper grammar:
  - "1 Opening Job" (singular)
  - "5 Opening Jobs" (plural)

#### B. Interactions
- [ ] Hover on card shows pointer cursor
- [ ] Click company name → navigates to details
- [ ] Click job button → navigates to details
- [ ] Links use `<Link>` (no `<a>` tags)

#### C. Data Handling
- [ ] Company with 0 jobs shows "0 Opening Jobs"
- [ ] Company name truncates if too long (CSS handles)
- [ ] Location displays "Location not specified" if missing

---

### 3. CompanyDetails Page (`/company-details/:id`)

#### A. Initial Load
- [ ] Navigate from company list
- [ ] Loading spinner appears
- [ ] Company details load and display
- [ ] Page title shows "Company Details"

#### B. Company Information Sidebar
- [ ] Logo displays (centered, rounded)
- [ ] Company name displays
- [ ] "Since [date]" displays formatted (e.g., "January 2020")
- [ ] Social links appear only if URLs exist:
  - Facebook icon/link
  - WhatsApp icon/link
  - LinkedIn icon/link
- [ ] Company info section shows:
  - Location
  - Employees count (if exists)
  - Working days (if exists)
  - Weekend (if exists)
  - Website link (opens in new tab)

#### C. Main Content Area
- [ ] "About [Company Name]" heading displays
- [ ] Description displays (or default text)
- [ ] Gallery section appears only if images exist
- [ ] Gallery images load (or hide if broken)
- [ ] "Open Positions (X)" heading shows correct count
- [ ] Active jobs list displays
- [ ] Each job card renders correctly
- [ ] "No open positions" message if count is 0

#### D. Gallery
- [ ] Images display in 3-column grid (medium screens)
- [ ] Images are rounded
- [ ] Broken images hide gracefully (display: none)
- [ ] Section doesn't appear if no gallery images

#### E. Jobs Section
- [ ] Only ACTIVE jobs display
- [ ] Jobs render using JobListCard component
- [ ] Job cards are clickable
- [ ] Empty state shows if no active jobs

#### F. Action Buttons
- [ ] "Contact Company" button links to `/contact`
- [ ] "Back to Companies" button links to `/company-list`
- [ ] Buttons use React Router Links

#### G. Error Handling
- [ ] Invalid company ID → Shows error message
- [ ] "Back to Companies" button appears
- [ ] Non-existent company → Shows "Company not found"
- [ ] API error → Shows error gracefully

---

## 🔍 Browser DevTools Checks

### Console Tab
- [ ] No React errors
- [ ] No PropTypes warnings
- [ ] No 404 errors for images (gracefully handled)
- [ ] No CORS errors

### Network Tab
- [ ] GET `/api/companies` → 200 OK
- [ ] GET `/api/companies/:id` → 200 OK
- [ ] GET `/api/companies/:id/jobs` → 200 OK
- [ ] Response includes pagination metadata
- [ ] Pagination params sent in query string

### React DevTools
- [ ] CompanyCard receives correct props
- [ ] Props match PropTypes definition
- [ ] State updates correctly on pagination
- [ ] URL params sync with state

---

## 📱 Responsive Testing

### Desktop (>1200px)
- [ ] 3 companies per row
- [ ] Pagination centered
- [ ] Sort dropdown aligned right
- [ ] Company details: 4-column + 8-column layout

### Tablet (768px - 1199px)
- [ ] 2 companies per row
- [ ] Pagination remains centered
- [ ] Gallery: 3 columns
- [ ] Details page maintains layout

### Mobile (<768px)
- [ ] 1 company per row
- [ ] Company cards full width
- [ ] Pagination stacks vertically
- [ ] Sort dropdown full width
- [ ] Details page: sidebar stacks on top

---

## 🐛 Known Issues to Verify Fixed

- [x] CompanyCard was hardcoded → Now dynamic
- [x] Company list had no pagination → Now working
- [x] Sorting dropdown didn't work → Now functional
- [x] Job count was hardcoded → Now from backend
- [x] CompanyDetails used wrong service → Now uses getCompanyJobs
- [x] Images had no fallback → Now handles errors
- [x] Used `<a>` tags → Now uses `<Link>`
- [x] Page reload on navigation → Now SPA behavior

---

## ✅ Acceptance Criteria

### Must Pass
- [ ] All companies display with correct data
- [ ] Pagination works for > 12 companies
- [ ] Sorting changes order correctly
- [ ] Navigation uses React Router (no reload)
- [ ] Company details page loads correctly
- [ ] Only active jobs display on company page
- [ ] Images handle errors gracefully
- [ ] UI design unchanged from original

### Nice to Have
- [ ] Smooth animations on page change
- [ ] Loading skeletons instead of spinners
- [ ] Infinite scroll instead of pagination
- [ ] Search/filter functionality

---

## 🚀 Quick Test Flow

1. **Start servers:**
   ```bash
   # Terminal 1 (Backend)
   cd server && npm start
   
   # Terminal 2 (Frontend)
   cd client && npm run dev
   ```

2. **Run API tests:**
   ```bash
   ./test-company-api.sh
   ```

3. **Manual frontend tests:**
   - Open `http://localhost:5173/company-list`
   - Test pagination (if available)
   - Test sorting
   - Click a company
   - Verify company details
   - Check job list
   - Test navigation back
   - Test with different company IDs

4. **Check browser console:**
   - No errors
   - No warnings
   - Clean network requests

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

CompanyList Tests:
[ ] Initial load
[ ] Pagination
[ ] Sorting
[ ] Navigation

CompanyCard Tests:
[ ] Visual elements
[ ] Interactions
[ ] Data handling

CompanyDetails Tests:
[ ] Company info
[ ] Gallery
[ ] Jobs section
[ ] Error handling

Browser Tests:
[ ] No console errors
[ ] Network requests OK
[ ] Responsive design

Status: [ ] PASS  [ ] FAIL
Notes: _____________________
```

---

## 🎓 Testing Tips

1. **Use realistic data** - Create companies with varying data (some with gallery, some without)
2. **Test edge cases** - Empty states, missing data, long company names
3. **Test all browsers** - Chrome, Firefox, Safari, Edge
4. **Use React DevTools** - Inspect props and state
5. **Check network throttling** - Test loading states with slow 3G
6. **Clear cache** - Test with fresh page loads
7. **Test URL bookmarking** - Copy pagination URL and reload

---

**Testing Status:** Ready for QA  
**Expected Duration:** 30-45 minutes for full manual test  
**Automated Tests:** Backend API script provided
