import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { setAccessToken, setRefreshToken, setUserData } from '@/services/auth.session';

/**
 * NewPassword Component
 * Updated to work with OTP-based password reset
 */
export default function NewPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Get email from location state (passed from VerifyEmail after OTP verification)
  const email = location.state?.email || '';
  const otpVerified = location.state?.otpVerified || false;
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Redirect if OTP not verified
   */
  useEffect(() => {
    if (!email || !otpVerified) {
      navigate('/reset-password');
    }
  }, [email, otpVerified, navigate]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      setError('Password must include letters and numbers');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        email,
        password: formData.password,
      });

      if (response.success) {
        setSuccess(true);
        
        // Auto-login user with returned credentials
        if (response.accessToken && response.user) {
          setAccessToken(response.accessToken);
          if (response.refreshToken) {
            setRefreshToken(response.refreshToken);
          }
          setUserData(response.user);
          login(response.user);
          
          // Redirect to appropriate page after 2 seconds
          setTimeout(() => {
            const redirectPath = response.user.role === 'recruiter' || response.user.role === 'company'
              ? '/companies/profile' 
              : '/';
            navigate(redirectPath);
          }, 2000);
        } else {
          // Redirect to login if no auto-login
          setTimeout(() => {
            navigate('/sign-in');
          }, 2000);
        }
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      const errorMessage = err.response?.status === 429 
        ? 'Too many requests. Please try again later.'
        : err.response?.data?.message || 'Invalid or expired reset token';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <section className="bg-auth">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-12">
                <div className="card auth-box">
                  <div className="row g-0">
                    {/* Logo and Illustration Side */}
                    <div className="col-lg-6 text-center">
                      <div className="card-body p-4">
                        <Link to="/" className="brand-logo-link">
                          <span className="brand-logo-text">InternNova</span>
                        </Link>
                        <div className="mt-5">
                          <img 
                            src="/assets/images/auth/reset-password.png" 
                            alt="Set New Password Illustration" 
                            className="img-fluid"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* New Password Form Side */}
                    <div className="col-lg-6">
                      <div className="auth-content card-body p-5 h-100 text-white">
                        <div className="text-center mb-4">
                          <h5>Set New Password</h5>
                          <p className="text-white-50">
                            Create a strong password for your account.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form text-white">
                          {/* Success Message */}
                          {success && (
                            <div className="alert alert-success" role="alert">
                              Password reset successful! Redirecting...
                            </div>
                          )}

                          {/* Error Message */}
                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}

                          {!success && (
                            <>
                              <div className="mb-3">
                                <label className="form-label" htmlFor="password">
                                  New Password
                                </label>
                                <div className="position-relative">
                                  <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    required
                                    disabled={loading}
                                    autoComplete="new-password"
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-white-50"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                  >
                                    {showPassword ? (
                                      <i className="mdi mdi-eye-off"></i>
                                    ) : (
                                      <i className="mdi mdi-eye"></i>
                                    )}
                                  </button>
                                </div>
                                <small className="text-white-50">
                                  Must be at least 8 characters with letters and numbers
                                </small>
                              </div>

                              <div className="mb-4">
                                <label className="form-label" htmlFor="confirmPassword">
                                  Confirm Password
                                </label>
                                <div className="position-relative">
                                  <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading}
                                    autoComplete="new-password"
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-white-50"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                  >
                                    {showConfirmPassword ? (
                                      <i className="mdi mdi-eye-off"></i>
                                    ) : (
                                      <i className="mdi mdi-eye"></i>
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3">
                                <button
                                  type="submit"
                                  className="btn btn-signup-box w-100"
                                  disabled={loading}
                                >
                                  {loading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                              </div>
                            </>
                          )}
                        </form>

                        <div className="mt-5 text-center text-white-50">
                          <p>
                            Remembered your password?{' '}
                            <Link 
                              to="/sign-in" 
                              className="fw-medium text-white text-decoration-underline"
                            >
                              Go to Login
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
        </section>
      </div>
    </div>
  );
}
