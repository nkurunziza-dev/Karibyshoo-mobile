import apiClient, { getApiErrorMessage } from './client';

export type AuthResponseStatus = 'success' | 'error';

export type BaseApiResponse = {
  status?: AuthResponseStatus | string;
  message?: string;
};

export type AuthUser = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  gender?: string;
  companyId?: number;
  userAccountType?: string;
  recordStatus?: string;
};

export type AuthLoginResponse = BaseApiResponse & {
  user?: AuthUser;
  accessToken?: string;
  refreshToken?: string;
};

export type LoginPayload = {
  emailAddress: string;
  password: string;
  rememberMe: boolean;
};

export type LoginPhonePayload = {
  phoneNumber: string;
};

export type LoginOtpPayload = {
  phoneNumber: string;
  otp: string;
};

export type CreateVisitorPayload = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  gender?: string;
};

export type VerifyCompanyEmailPayload = {
  emailAddress?: string;
  otp: string;
  companyId?: number | string | null;
};

export type CreatePasswordPayload = {
  newPassword: string;
  confirmPassword: string;
  otp: string;
  companyId?: number | string | null;
  userId?: number | string | null;
};

export type PasswordResetInitiatePayload = {
  emailAddress?: string;
  phoneNumber?: string;
};

export type PasswordResetVerifyPayload = {
  emailAddress?: string;
  phoneNumber?: string;
  otp: string;
};

export type PasswordResetConfirmPayload = {
  emailAddress?: string;
  phoneNumber?: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export const AuthAPI = {
  login: async (payload: LoginPayload) => apiClient.post<AuthLoginResponse>('/auth/login', payload),

  loginWithPhoneNumber: async (payload: LoginPhonePayload) =>
    apiClient.post<BaseApiResponse>('/auth/login/phone-number', payload),

  validateLoginOtp: async (payload: LoginOtpPayload) =>
    apiClient.post<AuthLoginResponse>('/auth/login/validate-otp', payload),

  resendOtp: async (payload: { emailAddress?: string; companyId?: number | string | null }) =>
    apiClient.post<BaseApiResponse>('/auth/resend-otp', payload),

  createVisitor: async (payload: CreateVisitorPayload) =>
    apiClient.post<BaseApiResponse>('/auth/create-visitor', payload),

  createCompany: async (payload: FormData) =>
    apiClient.post<BaseApiResponse>('/auth/create-company', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  verifyCompanyEmail: async (payload: VerifyCompanyEmailPayload) =>
    apiClient.post<BaseApiResponse>('/auth/verify-company-email', payload),

  requestPasswordReset: async (payload: PasswordResetInitiatePayload) =>
    apiClient.post<BaseApiResponse>('/auth/password-reset/request', payload),

  verifyPasswordResetOtp: async (payload: PasswordResetVerifyPayload) =>
    apiClient.post<BaseApiResponse>('/auth/password-reset/verify-otp', payload),

  confirmPasswordReset: async (payload: PasswordResetConfirmPayload) =>
    apiClient.post<BaseApiResponse>('/auth/password-reset/confirm', payload),

  createPassword: async (payload: CreatePasswordPayload) =>
    apiClient.post<AuthLoginResponse>('/auth/create-password', payload),
};

export const getAuthErrorMessage = getApiErrorMessage;
