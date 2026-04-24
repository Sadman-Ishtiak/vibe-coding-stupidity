import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, verifyOTP, resendOTP } from '@/services/auth.service';
import PasswordInput from '@/components/common/PasswordInput';
import OTPInput from '@/components/common/OTPInput';

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState('register'); // 'register' or 'verify-otp'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredUserType, setRegisteredUserType] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    accountType: 'candidate',
    profilePicture: null,
  });

  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  /* ------------------ VALIDATION ------------------ */
  const validateForm = () => {
    if (formData.username.trim().length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!['candidate', 'recruiter'].includes(formData.accountType)) {
      return 'Invalid account type selected';
    }
    return null;
  };

  /* ------------------ INPUT HANDLER ------------------ */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files?.[0];
      if (!file) {
        setFormData(prev => ({ ...prev, profilePicture: null }));
        setPreviewUrl(null);
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const MAX_BYTES = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Use PNG, JPG, GIF, or WEBP.');
        return;
      }

      if (file.size > MAX_BYTES) {
        setError('Profile picture must be under 2 MB.');
        return;
      }

      setError('');
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setPreviewUrl(URL.createObjectURL(file));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ------------------ CLEANUP ------------------ */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* ------------------ RESEND COOLDOWN TIMER ------------------ */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await signUp(formData);

      if (response?.success) {
        // Store email and user type for OTP verification
        setRegisteredEmail(formData.email);
        setRegisteredUserType(response.user?.userType || 'candidate');
        
        // Move to OTP verification step
        setStep('verify-otp');
        setResendCooldown(60); // 60 second cooldown for resend
      } else {
        setError(response?.message || 'Registration failed');
      }
    } catch (err) {
      const errorMsg = 
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        'Server error. Please try again later.';
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ OTP VERIFICATION ------------------ */
  const handleOTPVerify = async () => {
    if (otpLoading || otp.length !== 6) return;

    setError('');
    setOtpLoading(true);

    try {
      const response = await verifyOTP({
        email: registeredEmail,
        otp,
        purpose: 'signup',
      });

      if (response?.success) {
        // Redirect to login
        navigate('/sign-in', { 
          state: { 
            message: 'Email verified successfully! Please login to continue.' 
          } 
        });
      } else {
        setError(response?.message || 'OTP verification failed');
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        'Invalid OTP. Please try again.';
      
      setError(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  /* ------------------ RESEND OTP ------------------ */
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setLoading(true);

    try {
      const response = await resendOTP({
        email: registeredEmail,
        purpose: 'signup',
      });

      if (response?.success) {
        setResendCooldown(60); // Reset cooldown
        setOtp(''); // Clear OTP input
      } else {
        setError(response?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        'Failed to resend OTP. Please try again.';
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="main-content">
      <div className="page-content">
        <section className="bg-auth">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-12">
                <div className="card auth-box">
                  <div className="row align-items-center">
                    {/* Left side */}
                    <div className="col-lg-6 text-center">
                      <div className="card-body p-4">
                        <Link to="/" className="brand-logo-link">
                          <span className="brand-logo-text">InternNova</span>
                        </Link>
                        <div className="mt-5">
                          <img
                            src="/assets/images/auth/sign-up.png"
                            alt="Sign Up"
                            className="img-fluid"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form side */}
                    <div className="col-lg-6">
                      <div className="auth-content card-body p-5 text-white">
                        <div className="w-100">
                          <div className="text-center">
                            <h5>
                              {step === 'register' ? "Let's Get Started" : 'Verify Your Email'}
                            </h5>
                            <p className="text-white-70">
                              {step === 'register' 
                                ? 'Sign Up and get access to all the features of InternNova'
                                : `We've sent a 6-digit OTP to ${registeredEmail}`
                              }
                            </p>
                          </div>

                          {error && (
                            <div className="alert alert-danger">{error}</div>
                          )}

                          {step === 'register' ? (
                            <form onSubmit={handleSubmit} className="auth-form">
                            {/* Username */}
                            <div className="mb-3">
                              <label className="form-label">Username</label>
                              <input
                                name="username"
                                type="text"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                required
                              />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                              <label className="form-label">Email</label>
                              <input
                                name="email"
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                required
                              />
                            </div>

                            {/* Password */}
                            <PasswordInput
                              id="passwordInput"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              label="Password"
                              placeholder="Enter password"
                              helperText="Must be at least 8 characters with letters and numbers"
                              required
                              disabled={loading}
                              autoComplete="new-password"
                            />

                            {/* Profile Picture */}
                            <div className="mb-3">
                              <label className="form-label">Profile Picture</label>
                              <input
                                type="file"
                                className="form-control"
                                name="profilePicture"
                                accept="image/*"
                                onChange={handleChange}
                                disabled={loading}
                              />
                              {previewUrl && (
                                <div className="mt-2">
                                  <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="img-thumbnail"
                                    style={{ maxWidth: 120 }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Role */}
                            <div className="mb-3">
                              <label className="form-label d-block">
                                Create account as
                              </label>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="accountType"
                                  value="candidate"
                                  checked={formData.accountType === 'candidate'}
                                  onChange={handleChange}
                                  disabled={loading}
                                />
                                <label className="form-check-label">
                                  Candidate
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="accountType"
                                  value="recruiter"
                                  checked={formData.accountType === 'recruiter'}
                                  onChange={handleChange}
                                  disabled={loading}
                                />
                                <label className="form-check-label">
                                  Company/Recruiter
                                </label>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-signup-box w-100"
                              disabled={loading}
                            >
                              {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                          </form>
                          ) : (
                            /* OTP VERIFICATION STEP */
                            <div className="otp-verification">
                              <div className="mb-4">
                                <OTPInput
                                  length={6}
                                  value={otp}
                                  onChange={setOtp}
                                  onComplete={handleOTPVerify}
                                  disabled={otpLoading}
                                  error={!!error}
                                  autoFocus
                                />
                              </div>

                              <button
                                type="button"
                                onClick={handleOTPVerify}
                                className="btn btn-signup-box w-100 mb-3"
                                disabled={otpLoading || otp.length !== 6}
                              >
                                {otpLoading ? 'Verifying...' : 'Verify OTP'}
                              </button>

                              <div className="text-center">
                                {resendCooldown > 0 ? (
                                  <p className="text-white-70 mb-0">
                                    Resend OTP in {resendCooldown}s
                                  </p>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="btn btn-link text-white text-decoration-underline p-0"
                                    disabled={loading}
                                  >
                                    Resend OTP
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 text-center">
                            <p className="mb-0">
                              Already a member?{' '}
                              <Link to="/sign-in" className="fw-medium text-white text-decoration-underline">
                                Sign In
                              </Link>
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
