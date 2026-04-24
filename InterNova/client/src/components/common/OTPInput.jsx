import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * OTPInput Component
 * 
 * Features:
 * - Auto-focus first input
 * - Auto-advance on digit entry
 * - Backspace navigation
 * - Full OTP paste support
 * - Loading state
 * - Accessibility (ARIA labels, keyboard navigation)
 */
export default function OTPInput({ 
  length = 6, 
  value = '', 
  onChange, 
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Sync with external value prop
  useEffect(() => {
    if (value && value.length <= length) {
      const newOtp = value.split('').concat(Array(length - value.length).fill(''));
      setOtp(newOtp);
    }
  }, [value, length]);

  /**
   * Handle input change
   */
  const handleChange = (index, e) => {
    const val = e.target.value;

    // Only allow single digit
    if (val.length > 1) {
      return;
    }

    // Only allow numbers
    if (val && !/^\d$/.test(val)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Call onChange callback
    const otpString = newOtp.join('');
    if (onChange) {
      onChange(otpString);
    }

    // Auto-advance to next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  /**
   * Handle keydown (backspace navigation)
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        
        if (onChange) {
          onChange(newOtp.join(''));
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle paste event
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only allow numeric paste
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const pastedArray = pastedData.slice(0, length).split('');
    const newOtp = [...pastedArray, ...Array(length - pastedArray.length).fill('')];
    setOtp(newOtp);

    // Call onChange
    if (onChange) {
      onChange(newOtp.join(''));
    }

    // Focus the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Call onComplete if all filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  /**
   * Handle focus - select all text
   */
  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="otp-input-container">
      <div className="otp-inputs d-flex justify-content-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            disabled={disabled}
            className={`form-control text-center otp-input ${error ? 'is-invalid' : ''}`}
            aria-label={`OTP digit ${index + 1}`}
            autoComplete="off"
          />
        ))}
      </div>
      
      <style jsx>{`
        .otp-input-container {
          margin: 0 auto;
          max-width: 400px;
        }
        
        .otp-input {
          width: 50px;
          height: 50px;
          font-size: 24px;
          font-weight: bold;
          border: 2px solid #ced4da;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .otp-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          outline: none;
        }
        
        .otp-input:disabled {
          background-color: #e9ecef;
          cursor: not-allowed;
        }
        
        .otp-input.is-invalid {
          border-color: #dc3545;
        }
        
        .otp-input.is-invalid:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        @media (max-width: 576px) {
          .otp-input {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

OTPInput.propTypes = {
  length: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  autoFocus: PropTypes.bool,
};
