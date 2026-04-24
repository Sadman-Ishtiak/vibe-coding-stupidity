import { useState } from 'react';

/**
 * PasswordInput Component
 * 
 * A reusable password input with toggle visibility (eye icon)
 * Maintains consistent styling and accessibility
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - HTML id attribute
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change event handler
 * @param {string} [props.placeholder='Enter password'] - Placeholder text
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className='form-control'] - CSS class for input
 * @param {string} [props.autoComplete='current-password'] - Autocomplete attribute
 * @param {string} [props.label] - Optional label text
 * @param {string} [props.helperText] - Optional helper text below input
 * 
 * @example
 * <PasswordInput
 *   id="password"
 *   name="password"
 *   value={formData.password}
 *   onChange={handleChange}
 *   label="Password"
 *   helperText="Must be at least 8 characters"
 *   required
 * />
 */
export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter password',
  required = false,
  disabled = false,
  className = 'form-control',
  autoComplete = 'current-password',
  label,
  helperText
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      
      <div className="position-relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={className}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
          onClick={togglePasswordVisibility}
          tabIndex="-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            padding: '0.375rem 0.75rem',
            textDecoration: 'none',
            zIndex: 10
          }}
        >
          <i className={`mdi ${showPassword ? 'mdi-eye-off' : 'mdi-eye'}`}></i>
        </button>
      </div>
      
      {helperText && (
        <small className="text-white d-block mt-1">
          {helperText}
        </small>
      )}
    </div>
  );
}
