import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthStoreState = AuthTokens & {
  hydrate: () => Promise<void>;
  setTokens: (tokens: Partial<AuthTokens>) => Promise<void>;
  clear: () => Promise<void>;
};

const accessTokenKey = 'karibyshoo_access_token';
const refreshTokenKey = 'karibyshoo_refresh_token';

export const authStore = create<AuthStoreState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(accessTokenKey),
      SecureStore.getItemAsync(refreshTokenKey),
    ]);

    set({
      accessToken: accessToken ?? null,
      refreshToken: refreshToken ?? null,
    });
  },
  setTokens: async (tokens) => {
    const current = get();
    const nextTokens = {
      accessToken: tokens.accessToken ?? current.accessToken ?? null,
      refreshToken: tokens.refreshToken ?? current.refreshToken ?? null,
    };

    if (nextTokens.accessToken) {
      await SecureStore.setItemAsync(accessTokenKey, nextTokens.accessToken);
    } else {
      await SecureStore.deleteItemAsync(accessTokenKey);
    }

    if (nextTokens.refreshToken) {
      await SecureStore.setItemAsync(refreshTokenKey, nextTokens.refreshToken);
    } else {
      await SecureStore.deleteItemAsync(refreshTokenKey);
    }

    set(nextTokens);
  },
  clear: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(accessTokenKey),
      SecureStore.deleteItemAsync(refreshTokenKey),
    ]);

    set({
      accessToken: null,
      refreshToken: null,
    });
  },
}));

export default authStore;
