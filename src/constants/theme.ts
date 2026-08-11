/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const designTokens = {
  primary: '#5a3c9a',
  primaryStrong: '#4a2f83',
  primarySoft: '#f2ebff',
  surface: '#f4eef9',
  surfaceStrong: '#f6f2fb',
  card: '#f5f5f7',
  border: '#d8d7df',
  text: '#2c2c32',
  textSecondary: '#6d6b77',
  textMuted: '#8d8b96',
  white: '#ffffff',
  error: '#d95a5a',
  success: '#2c9e76',
  softShadow: 'rgba(90, 60, 154, 0.12)',
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 28,
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 20,
  fontSizeXl: 28,
  fontSize2xl: 32,
} as const;

export const Colors = {
  light: {
    text: designTokens.text,
    background: designTokens.white,
    backgroundElement: designTokens.card,
    backgroundSelected: designTokens.primarySoft,
    textSecondary: designTokens.textSecondary,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
