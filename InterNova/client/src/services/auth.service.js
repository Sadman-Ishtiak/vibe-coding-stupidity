import api from "@/config/api";
import { API_PATHS } from "@/config/api.paths";
import { authLog } from "@/utils/authLogger";

export const signUp = async (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  try {
    const res = await api.post(API_PATHS.AUTH.REGISTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (payload) => {
  try {
    const res = await api.post(API_PATHS.AUTH.LOGIN, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  const res = await api.get(API_PATHS.AUTH.ME);
  return res.data;
};

export const signOut = async () => {
  try {
    const res = await api.post(API_PATHS.AUTH.LOGOUT);
    return res.data;
  } catch (error) {
    authLog.logoutFailed(error);
    throw error;
  }
};

export const forgotPassword = async (payload) => {
  const res = await api.post(API_PATHS.AUTH.FORGOT_PASSWORD, payload);
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await api.post(API_PATHS.AUTH.RESET_PASSWORD, payload);
  return res.data;
};

/**
 * Send OTP for email verification
 * @param {object} payload - { email, purpose: 'signup' | 'reset' }
 */
export const sendOTP = async (payload) => {
  try {
    const res = await api.post(API_PATHS.AUTH.OTP.SEND, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify OTP
 * @param {object} payload - { email, otp, purpose: 'signup' | 'reset' }
 */
export const verifyOTP = async (payload) => {
  try {
    const res = await api.post(API_PATHS.AUTH.OTP.VERIFY, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Resend OTP
 * @param {object} payload - { email, purpose: 'signup' | 'reset' }
 */
export const resendOTP = async (payload) => {
  try {
    const res = await api.post(API_PATHS.AUTH.OTP.RESEND, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};
