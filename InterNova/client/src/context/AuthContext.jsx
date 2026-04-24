import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isAuthenticated, clearAuth, getAccountType, getUserData, setUserData } from '@/services/auth.session';
import { signOut, getMe } from '@/services/auth.service';
import { onLogout } from '@/config/api';
import { authLog } from '@/utils/authLogger';

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Provides authentication state and methods throughout the app
 * Professional MERN pattern using React Context API
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [profileCache, setProfileCache] = useState(null); // Profile cache

  // Load user from session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (isAuthenticated()) {
          // First try to load from local storage for immediate UI
          const cachedUser = getUserData();
          if (cachedUser) {
            setUser(cachedUser);
            setIsAuth(true);
            setProfileCache(cachedUser); // Initialize cache
            authLog.sessionRestored(cachedUser);
          }
          
          // ✅ Always validate with server - critical for token expiry
          try {
            const response = await getMe();
            if (response.success && response.data) {
              // Update with fresh server data
              setUser(response.data);
              setIsAuth(true);
              setProfileCache(response.data); // Update cache
              // ✅ CRITICAL: Update localStorage with fresh server data
              setUserData(response.data);
              authLog.getMeSuccess(response.data);
            } else {
              // Server says not authenticated - clear everything
              authLog.getMeFailed({ message: 'Invalid response' });
              clearAuth();
              setUser(null);
              setIsAuth(false);
              setProfileCache(null); // Clear cache
              authLog.sessionCleared('Invalid server response');
            }
          } catch (error) {
            // ✅ If /auth/me fails (401, 403, etc), clear auth state
            authLog.getMeFailed(error);
            if (error.response?.status === 401) {
              authLog.tokenExpired();
              authLog.autoLogout('Token expired on startup');
            }
            clearAuth();
            setUser(null);
            setIsAuth(false);
            setProfileCache(null); // Clear cache
            authLog.sessionCleared('Token validation failed');
          }
        }
      } catch (error) {
        authLog.getMeFailed(error);
        clearAuth();
        setUser(null);
        setIsAuth(false);
        setProfileCache(null); // Clear cache
        authLog.sessionCleared('Error loading user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ Listen for logout events from axios interceptor
  useEffect(() => {
    const unsubscribe = onLogout(() => {
      authLog.autoLogout('Triggered by axios interceptor');
      setUser(null);
      setIsAuth(false);
      setProfileCache(null); // Clear cache on logout
      authLog.sessionCleared('Auto-logout from interceptor');
    });
    return unsubscribe;
  }, []);

  // Handle user login
  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuth(true);
    setProfileCache(userData); // Set cache on login
    // ✅ Save to localStorage on login
    setUserData(userData);
    authLog.loginSuccess(userData);
  }, []);

  // Handle user logout
  const logout = useCallback(async () => {
    try {
      await signOut();
      authLog.logoutSuccess();
    } catch (error) {
      authLog.logoutFailed(error);
    } finally {
      clearAuth();
      setUser(null);
      setIsAuth(false);
      setProfileCache(null); // Clear cache on logout
      authLog.sessionCleared('Manual logout');
    }
  }, []);

  // Update user data (invalidates cache)
  const updateUser = useCallback((userData) => {
    setUser(prev => {
      const updated = { ...prev, ...userData };
      setProfileCache(updated); // Update cache when user is updated
      // ✅ CRITICAL: Sync with localStorage to persist after refresh
      setUserData(updated);
      return updated;
    });
  }, []);

  // Get cached profile
  const getCachedProfile = useCallback(() => {
    return profileCache;
  }, [profileCache]);

  // Clear profile cache (for manual refresh)
  const clearProfileCache = useCallback(() => {
    setProfileCache(null);
  }, []);

  // Get user role/account type
  const getUserRole = useCallback(() => {
    if (!user) return null;
    const role = user.accountType || user.role || getAccountType();
    return role?.toLowerCase() === 'company' ? 'recruiter' : role?.toLowerCase() || 'candidate';
  }, [user]);

  const value = {
    user,
    isAuth,
    loading,
    login,
    logout,
    updateUser,
    getUserRole,
    profileCache,
    getCachedProfile,
    clearProfileCache,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * Access authentication state and methods
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
