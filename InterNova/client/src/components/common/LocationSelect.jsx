import { BANGLADESH_DISTRICTS } from '@/data/bangladeshDistricts';

/**
 * LocationSelect Component
 * 
 * A reusable select component for choosing Bangladesh districts.
 * Displays all 64 districts in alphabetical order.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Selected district value
 * @param {Function} props.onChange - Change event handler
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {boolean} [props.required=false] - Whether the select is required
 * @param {string} [props.className='form-select'] - CSS class for the select element
 * @param {string} [props.placeholder='Select district'] - Placeholder text for empty option
 * @param {string} [props.id] - HTML id attribute
 * @param {boolean} [props.includeRemote=false] - Whether to include 'Remote' option
 * 
 * @example
 * // Basic usage
 * <LocationSelect
 *   name="location"
 *   value={formData.location}
 *   onChange={handleChange}
 *   required
 * />
 * 
 * @example
 * // With Remote option
 * <LocationSelect
 *   name="location"
 *   value={formData.location}
 *   onChange={handleChange}
 *   includeRemote
 *   required
 * />
 */
export default function LocationSelect({
  name,
  value,
  onChange,
  disabled = false,
  required = false,
  className = 'form-select',
  placeholder = 'Select district',
  id,
  includeRemote = false
}) {
  return (
    <select
      id={id}
      name={name}
      className={className}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    >
      <option value="">{placeholder}</option>
      {BANGLADESH_DISTRICTS.map((district) => (
        <option key={district} value={district}>
          {district}
        </option>
      ))}
      {includeRemote && <option value="Remote">Remote</option>}
    </select>
  );
}
