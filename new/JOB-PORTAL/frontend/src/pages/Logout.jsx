import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    try {
      authService.logout();
    } catch (e) {
      // ignore
    }
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Signing you out…</p>
    </div>
  );
};

export default Logout;
