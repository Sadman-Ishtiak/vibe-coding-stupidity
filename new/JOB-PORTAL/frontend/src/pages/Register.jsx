import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    accept: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.accept) {
      setError('You must accept the Terms and Privacy Policy.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      await authService.register(payload);
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to create account. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Join as a candidate or a company</p>
          </div>

          {error && <div className="auth-alert error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-field">
              <label>Email</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required minLength={6} />
                </div>
              </div>
              <div className="form-field">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">✅</span>
                  <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>Register as</label>
              <select name="role" value={formData.role} onChange={handleChange} className="filter-select">
                <option value="candidate">Candidate</option>
                <option value="company">Company</option>
              </select>
            </div>

            <label className="checkbox">
              <input type="checkbox" name="accept" checked={formData.accept} onChange={handleChange} />
              <span>
                I accept the <button type="button" className="as-link" onClick={()=>window.open('/terms','_self')}>Terms</button>
                {' '}and{' '}
                <button type="button" className="as-link" onClick={()=>window.open('/privacy','_self')}>Privacy Policy</button>.
              </span>
            </label>

            <button className="btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <div className="auth-socials">
            <button className="btn-outline w-100" type="button" disabled>Continue with Google</button>
            <button className="btn-outline w-100" type="button" disabled>Continue with GitHub</button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
