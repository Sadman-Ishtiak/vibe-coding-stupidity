import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signIn, resendOTP } from '@/services/auth.service';
import { setAccessToken, setRefreshToken, setUserData, setAccountType } from '@/services/auth.session';
import { useAuth } from '@/context/AuthContext';
import PasswordInput from '@/components/common/PasswordInput';

/**
 * SignIn Component
 * UI remains unchanged
 * Logic improved for production readiness
 */
export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '', // Email field for authentication
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /* ------------------ SHOW SUCCESS MESSAGE FROM NAVIGATION ------------------ */
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /* ------------------ INPUT HANDLER ------------------ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /* ------------------ BASIC VALIDATION ------------------ */
  const validateForm = () => {
    if (!formData.identifier.trim()) {
      return 'Email is required';
    }
    if (!formData.password) {
      return 'Password is required';
    }
    return null;
  };

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
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await signIn({
        identifier: formData.identifier,
        password: formData.password,
      });

      if (response?.success) {
        // Store access token
        if (response.accessToken) {
          setAccessToken(response.accessToken);
        }

        // Store refresh token
        if (response.refreshToken) {
          setRefreshToken(response.refreshToken);
        }

        // Store user data
        if (response.user) {
          setUserData(response.user);
          setAccountType(response.user.role);
          login(response.user);
        }

        // Role-based redirect
        const userRole = response.user?.role?.toLowerCase();
        if (userRole === 'recruiter' || userRole === 'company') {
          navigate('/companies/profile', { replace: true });
        } else if (userRole === 'candidate') {
          navigate('/', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(response?.message || 'Invalid credentials');
      }
    } catch (err) {
      // Check if error is email not verified
      if (err?.response?.data?.requiresEmailVerification) {
        // Resend OTP automatically
        try {
          await resendOTP({
            email: formData.identifier,
            purpose: 'signup',
          });
          
          // Redirect to verification page
          navigate('/verify-email', {
            state: {
              email: formData.identifier,
              purpose: 'signup',
              userType: err?.response?.data?.userType || 'candidate',
            },
          });
        } catch (resendErr) {
          setError('Email not verified. Please contact support.');
        }
      } else {
        setError(
          err?.response?.data?.message ||
          'Unable to sign in. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI (UNCHANGED) ------------------ */
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
                          <span className="brand-logo-text">INTERNNOVA</span>
                        </Link>
                        <div className="mt-5">
                          <img
                            src="/assets/images/auth/sign-in.png"
                            alt="Sign In Illustration"
                            className="img-fluid"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sign In Form Side */}
                    <div className="col-lg-6">
                      <div className="auth-content card-body p-5 h-100 text-white">
                        <div className="w-100">
                          <div className="text-center mb-4">
                            <h5>Welcome Back!</h5>
                            <p className="text-white-70">
                              Sign in to continue to InternNova.
                            </p>
                          </div>

                          {successMessage && (
                            <div className="alert alert-success" role="alert">
                              {successMessage}
                            </div>
                          )}

                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}

                          <form onSubmit={handleSubmit} className="auth-form">
                            <div className="mb-3">
                              <label htmlFor="emailInput" className="form-label">
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                              />
                            </div>

                            <PasswordInput
                              id="passwordInput"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              label="Password"
                              placeholder="Enter your password"
                              required
                              disabled={loading}
                            />

                            <div className="mb-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="flexCheckDefault"
                                  name="rememberMe"
                                  checked={formData.rememberMe}
                                  onChange={handleChange}
                                  disabled={loading}
                                />
                                <Link
                                  to="/reset-password"
                                  className="float-end text-white text-decoration-none"
                                >
                                  Forgot Password?
                                </Link>
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  Remember me
                                </label>
                              </div>
                            </div>

                            <div className="text-center">
                              <button
                                type="submit"
                                className="btn btn-signup-box w-100"
                                disabled={loading}
                              >
                                {loading ? 'Signing In...' : 'Sign In'}
                              </button>
                            </div>
                          </form>

                          <div className="mt-4 text-center">
                            <p className="mb-0">
                              Don't have an account?{' '}
                              <Link
                                to="/sign-up"
                                className="fw-medium text-white text-decoration-underline"
                              >
                                Sign Up
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
