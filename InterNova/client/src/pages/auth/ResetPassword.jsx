import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resendOTP } from '@/services/auth.service';

/**
 * ResetPassword Component
 * Updated to work with OTP-based password reset
 */
export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      
      if (response?.success) {
        setSuccess(true);
        
        // Redirect to OTP verification page after showing success
        setTimeout(() => {
          navigate('/verify-email', {
            state: {
              email,
              purpose: 'reset',
            },
          });
        }, 1500);
      } else {
        setError(response?.message || 'Failed to send OTP');
      }
    } catch (err) {
      const errorMessage = err.response?.status === 429 
        ? 'Too many requests. Please try again later.'
        : 'An error occurred. Please try again.';
      
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
                            alt="Reset Password Illustration" 
                            className="img-fluid"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reset Password Form Side */}
                    <div className="col-lg-6">
                      <div className="auth-content card-body p-5 h-100 text-white">
                        <div className="text-center mb-4">
                          <h5>Reset Password</h5>
                          <p className="text-white-50">
                            Reset your password with InternNova.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form text-white">
                          <div className="alert alert-warning text-center mb-4" role="alert">
                            Enter your Email and an OTP will be sent to you!
                          </div>

                          {/* Success Message */}
                          {success && (
                            <div className="alert alert-success" role="alert">
                              OTP sent successfully! Redirecting to verification...
                            </div>
                          )}

                          {/* Error Message */}
                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}

                          <div className="mb-4">
                            <label className="form-label" htmlFor="email">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              required
                              disabled={loading}
                            />
                          </div>

                          <div className="mt-3">
                            <button
                              type="submit"
                              className="btn btn-signup-box w-100"
                              disabled={loading}
                            >
                              {loading ? 'Sending...' : 'Send Request'}
                            </button>
                          </div>
                        </form>

                        <div className="mt-5 text-center text-white-50">
                          <p>
                            Remembered It?{' '}
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
