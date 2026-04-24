# LocationSelect Component - Implementation Guide

## Overview
A reusable location select component for Bangladesh's 64 districts. Zero UI changes, seamless integration.

---

## Architecture

### Files Created
1. **`/client/src/data/bangladeshDistricts.js`** - Single source of truth for district data
2. **`/client/src/components/common/LocationSelect.jsx`** - Reusable component
3. **`/client/src/components/common/index.js`** - Clean exports

---

## Usage Examples

### Example 1: Basic Usage (PostJob.jsx - Already Integrated)

```jsx
import { LocationSelect } from '@/components/common';

function PostJob() {
  const [formData, setFormData] = useState({
    location: '',
    // ... other fields
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <div className="col-md-6">
        <label className="form-label">Job Location (District)</label>
        <LocationSelect
          name="location"
          value={formData.location}
          onChange={handleChange}
          includeRemote
          required
        />
      </div>
    </form>
  );
}
```

---

### Example 2: Candidate Profile (Add Location Field)

```jsx
import { LocationSelect } from '@/components/common';

function CandidateProfile() {
  const [profile, setProfile] = useState({
    name: '',
    location: '',
    // ... other fields
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-3">
      <label htmlFor="locationInput" className="form-label">
        Your District
      </label>
      <LocationSelect
        id="locationInput"
        name="location"
        value={profile.location}
        onChange={handleInputChange}
        required
      />
    </div>
  );
}
```

---

### Example 3: Search/Filter Form

```jsx
import { LocationSelect } from '@/components/common';

function JobSearchFilter() {
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    // ... other filters
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-form">
      <div className="mb-3">
        <label className="form-label">Filter by Location</label>
        <LocationSelect
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="All districts"
        />
      </div>
    </div>
  );
}
```

---

### Example 4: Company Profile

```jsx
import { LocationSelect } from '@/components/common';

function CompanyProfile() {
  const [company, setCompany] = useState({
    name: '',
    headquarters: '',
    // ... other fields
  });

  const updateCompanyField = (e) => {
    setCompany(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form className="company-form">
      <div className="col-md-6">
        <label className="form-label">Headquarters Location</label>
        <LocationSelect
          name="headquarters"
          value={company.headquarters}
          onChange={updateCompanyField}
          placeholder="Select headquarters district"
          required
        />
      </div>
    </form>
  );
}
```

---

### Example 5: Multi-Location Selection (Optional Enhancement)

For pages that need multiple location fields:

```jsx
import { LocationSelect } from '@/components/common';

function CompanyBranches() {
  const [branches, setBranches] = useState({
    mainOffice: '',
    branchOffice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranches(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label">Main Office</label>
        <LocationSelect
          name="mainOffice"
          value={branches.mainOffice}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Branch Office</label>
        <LocationSelect
          name="branchOffice"
          value={branches.branchOffice}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
```

---

## Component API

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | string | - | ✅ | Input name attribute |
| `value` | string | - | ✅ | Selected district value |
| `onChange` | function | - | ✅ | Change event handler |
| `disabled` | boolean | `false` | ❌ | Disables the select |
| `required` | boolean | `false` | ❌ | Makes field required |
| `className` | string | `'form-select'` | ❌ | CSS class (Bootstrap compatible) |
| `placeholder` | string | `'Select district'` | ❌ | Empty option text |
| `id` | string | - | ❌ | HTML id attribute |
| `includeRemote` | boolean | `false` | ❌ | Adds "Remote" option |

---

## Data Access

If you need the districts data elsewhere (e.g., for validation, filtering):

```jsx
import { BANGLADESH_DISTRICTS, isValidDistrict } from '@/data/bangladeshDistricts';

// Get all districts
const allDistricts = BANGLADESH_DISTRICTS;

// Validate a district
const isValid = isValidDistrict('Dhaka'); // true
const isValid2 = isValidDistrict('InvalidCity'); // false
```

---

## Features

✅ **Zero UI Changes** - Uses existing Bootstrap `form-select` class  
✅ **64 Districts** - Complete, alphabetically sorted list  
✅ **Fully Controlled** - Works with any React form pattern  
✅ **Accessible** - Proper HTML semantics  
✅ **Optional Remote** - Toggle remote work option via prop  
✅ **Reusable** - One import, works everywhere  
✅ **Type-Safe Ready** - Easy to add TypeScript types if needed  

---

## Migration Guide

### Before (Hardcoded):
```jsx
<select name="location" className="form-select" value={formData.location} onChange={handleChange}>
  <option value="">Select district</option>
  <option value="Dhaka">Dhaka</option>
  <option value="Chattogram">Chattogram</option>
  {/* Limited districts... */}
</select>
```

### After (Reusable):
```jsx
import { LocationSelect } from '@/components/common';

<LocationSelect
  name="location"
  value={formData.location}
  onChange={handleChange}
  includeRemote
  required
/>
```

**Result:** 64 districts instead of 8, zero UI changes, 90% less code.

---

## Notes

- **No new dependencies** - Uses standard React and HTML
- **Bootstrap compatible** - Default `form-select` class applies all existing styles
- **Performance** - 64 options render instantly, no performance issues
- **Maintainability** - Update `bangladeshDistricts.js` once, changes apply everywhere
- **Scalability** - Easy to extend (add divisions, upazilas, etc. in the future)

---

## Integration Checklist

- [x] District data file created
- [x] LocationSelect component created
- [x] Common components index updated
- [x] PostJob.jsx updated and working
- [ ] Update SignUp.jsx (if location field needed)
- [ ] Update CandidateProfile.jsx (if location field needed)
- [ ] Update CompanyProfile.jsx (if location field needed)
- [ ] Update any search/filter forms (if location filter needed)

---

## Future Enhancements (Optional)

1. **Divisions Support**: Group districts by division
2. **TypeScript**: Add proper type definitions
3. **Search/Autocomplete**: Add filtering for large lists (future)
4. **Multi-select**: Support selecting multiple districts

---

**Status:** ✅ Ready for production use
