import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '@/services/auth.service';
import OTPInput from '@/components/common/OTPInput';

/**
 * VerifyEmail Component
 * Standalone OTP verification page for users who need to verify their email
 */
export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and purpose from location state or URL params
  const email = location.state?.email || '';
  const purpose = location.state?.purpose || 'signup';
  const userType = location.state?.userType || 'candidate';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ------------------ RESEND COOLDOWN TIMER ------------------ */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /* ------------------ REDIRECT IF NO EMAIL ------------------ */
  useEffect(() => {
    if (!email) {
      navigate('/sign-in');
    }
  }, [email, navigate]);

  /* ------------------ VERIFY OTP ------------------ */
  const handleVerifyOTP = async () => {
    if (loading || otp.length !== 6) return;

    setError('');
    setLoading(true);

    try {
      const response = await verifyOTP({
        email,
        otp,
        purpose,
      });

      if (response?.success) {
        setSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          if (purpose === 'signup') {
            navigate('/sign-in', {
              state: {
                message: 'Email verified successfully! Please login to continue.',
              },
            });
          } else if (purpose === 'reset') {
            navigate('/new-password', {
              state: {
                email,
                otpVerified: true,
              },
            });
          }
        }, 2000);
      } else {
        setError(response?.message || 'OTP verification failed');
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || 'Invalid OTP. Please try again.';

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ RESEND OTP ------------------ */
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setLoading(true);

    try {
      const response = await resendOTP({
        email,
        purpose,
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
                            src="/assets/images/auth/sign-up.png"
                            alt="Verify Email"
                            className="img-fluid"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Verification Form Side */}
                    <div className="col-lg-6">
                      <div className="auth-content card-body p-5 h-100 text-white">
                        <div className="w-100">
                          <div className="text-center mb-4">
                            <h5>Verify Your Email</h5>
                            <p className="text-white-70">
                              We've sent a 6-digit OTP to
                            </p>
                            <p className="fw-bold text-white">{email}</p>
                          </div>

                          {success && (
                            <div className="alert alert-success" role="alert">
                              Email verified successfully! Redirecting...
                            </div>
                          )}

                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}

                          {!success && (
                            <>
                              <div className="mb-4">
                                <OTPInput
                                  length={6}
                                  value={otp}
                                  onChange={setOtp}
                                  onComplete={handleVerifyOTP}
                                  disabled={loading}
                                  error={!!error}
                                  autoFocus
                                />
                              </div>

                              <button
                                type="button"
                                onClick={handleVerifyOTP}
                                className="btn btn-signup-box w-100 mb-3"
                                disabled={loading || otp.length !== 6}
                              >
                                {loading ? 'Verifying...' : 'Verify OTP'}
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
                            </>
                          )}

                          <div className="mt-4 text-center">
                            <p className="mb-0">
                              <Link
                                to="/sign-in"
                                className="fw-medium text-white text-decoration-underline"
                              >
                                Back to Sign In
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
