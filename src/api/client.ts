import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { useAuthStore } from '@/store/auth';

const baseUrl =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'http://localhost:8080/api/v1';

export const getApiErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message?: string; error?: string; status?: string }>;
  const payload = axiosError.response?.data;

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  if (typeof axiosError.message === 'string' && axiosError.message.trim()) {
    return axiosError.message;
  }

  return 'Something went wrong. Please try again.';
};

const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const accessToken = await SecureStore.getItemAsync('access_token');

  if (accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        const response = await axios.post(
          `${baseUrl}/auth/refresh/token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const nextAccessToken = response.data?.accessToken ?? response.data?.access_token;
        const nextRefreshToken = response.data?.refreshToken ?? response.data?.refresh_token ?? refreshToken;

        if (!nextAccessToken) {
          throw new Error('Refresh token response did not include an access token');
        }

        await Promise.all([
          SecureStore.setItemAsync('access_token', String(nextAccessToken)),
          SecureStore.setItemAsync('refresh_token', String(nextRefreshToken)),
        ]);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        }

        return apiClient.request(originalRequest);
      } catch (refreshError) {
        await useAuthStore.getState().clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
