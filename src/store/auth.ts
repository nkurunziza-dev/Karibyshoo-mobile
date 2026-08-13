import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthState = AuthTokens & {
  setTokens: (tokens: Partial<AuthTokens>) => Promise<void>;
  clear: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: async (tokens) => {
    const nextAccessToken = tokens.accessToken ?? null;
    const nextRefreshToken = tokens.refreshToken ?? null;

    await Promise.all([
      nextAccessToken ? SecureStore.setItemAsync('access_token', nextAccessToken) : SecureStore.deleteItemAsync('access_token'),
      nextRefreshToken ? SecureStore.setItemAsync('refresh_token', nextRefreshToken) : SecureStore.deleteItemAsync('refresh_token'),
    ]);

    set({
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    });
  },
  clear: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('access_token'),
      SecureStore.deleteItemAsync('refresh_token'),
    ]);

    set({ accessToken: null, refreshToken: null });
  },
}));

export const getStoredAccessToken = async () => SecureStore.getItemAsync('access_token');
export const getStoredRefreshToken = async () => SecureStore.getItemAsync('refresh_token');
