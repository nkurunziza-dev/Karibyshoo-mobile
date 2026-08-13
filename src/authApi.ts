import axios, { AxiosError } from 'axios';

import { authStore } from './authStore';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'RATHER_NOT_SAY';

export type ApiErrorResponse = {
  status?: string | null;
  message?: string | null;
  error?: string | null;
  detail?: string | null;
  [key: string]: unknown;
};

export type AuthLoginResponse = {
  status?: string | null;
  message?: string | null;
  user?: Record<string, unknown>;
  accessToken?: string;
  refreshToken?: string;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorResponse | undefined;
    if (payload) {
      if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message;
      }
      if (typeof payload.error === 'string' && payload.error.trim()) {
        return payload.error;
      }
      if (typeof payload.detail === 'string' && payload.detail.trim()) {
        return payload.detail;
      }
      if (typeof payload.status === 'string' && payload.status.trim()) {
        return payload.status;
      }
    }
    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

api.interceptors.request.use(async (config) => {
  const token = authStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const refreshToken = authStore.getState().refreshToken;
    if (!refreshToken) {
      await authStore.getState().clear();
      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh/token`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const accessToken = refreshResponse.data?.accessToken as string | undefined;
      const nextRefreshToken = (refreshResponse.data?.refreshToken as string | undefined) ?? refreshToken;

      if (accessToken) {
        await authStore.getState().setTokens({ accessToken, refreshToken: nextRefreshToken });

        const originalRequest = error.config;
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api.request(originalRequest ?? { method: 'GET', url: error.config?.url });
      }
    } catch (refreshError) {
      await authStore.getState().clear();
      return Promise.reject(refreshError);
    }

    await authStore.getState().clear();
    return Promise.reject(error);
  },
);

export const AuthAPI = {
  login: async (payload: { emailAddress: string; password: string; rememberMe?: boolean }) =>
    api.post<AuthLoginResponse>('/auth/login', payload),

  loginWithPhoneNumber: async (payload: { phoneNumber: string }) =>
    api.post<{ status?: string | null; message?: string | null }>('/auth/login/phone-number', payload),

  validateLoginOtp: async (payload: { phoneNumber: string; otp: string }) =>
    api.post<AuthLoginResponse>('/auth/login/validate-otp', payload),

  createVisitor: async (payload: {
    emailAddress: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: Gender;
  }) => api.post<{ status?: string | null; message?: string | null }>('/auth/create-visitor', payload),

  createCompany: async (formData: FormData) =>
    api.post<Record<string, unknown>>('/auth/create-company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  verifyCompanyEmail: async (payload: { emailAddress?: string; otp: string; companyId?: number | string }) =>
    api.post<{ status?: string | null; message?: string | null }>('/auth/verify-company-email', payload),

  resendOtp: async (payload: { emailAddress?: string; companyId?: number | string }) =>
    api.post<{ status?: string | null; message?: string | null }>('/auth/resend-otp', payload),

  requestPasswordReset: async (payload: { emailAddress?: string; phoneNumber?: string }) =>
    api.post<{ status?: string | null; message?: string | null }>('/auth/password-reset/request', payload),

  verifyPasswordResetOtp: async (payload: { emailAddress?: string; phoneNumber?: string; otp: string }) =>
    api.post<{ status?: string | null; message?: string | null }>('/auth/password-reset/verify-otp', payload),

  confirmPasswordReset: async (payload: {
    emailAddress?: string;
    phoneNumber?: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post<{ status?: string | null; message?: string | null }>('/auth/password-reset/confirm', payload),

  createPassword: async (payload: {
    newPassword: string;
    confirmPassword: string;
    otp: string;
    companyId?: number | string;
    userId?: number | string;
  }) => api.post<AuthLoginResponse>('/auth/create-password', payload),
};

export default AuthAPI;
