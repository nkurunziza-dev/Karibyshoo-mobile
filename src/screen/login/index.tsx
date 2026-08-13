import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AuthAPI, getAuthErrorMessage } from '@/api/auth';
import Checkbox from '@/components/ui/Checkbox';
import PasswordInput from '@/components/ui/PasswordInput';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';
import { useAuthStore } from '@/store/auth';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Enter your email, phone, or username.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const looksLikePhoneNumber = (value: string) => /^\+?[0-9][0-9\s-]*$/.test(value.trim()) && value.replace(/\D/g, '').length >= 8;

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(loginSchema),
  });

  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmitLogin = handleSubmit(async (values) => {
    const identifier = values.identifier.trim();
    setApiError(null);
    setIsSubmitting(true);

    try {
      if (looksLikePhoneNumber(identifier)) {
        const response = await AuthAPI.loginWithPhoneNumber({ phoneNumber: identifier });
        const message = response.data?.message ?? 'OTP sent to your phone number.';

        if (response.data?.status === 'success') {
          router.push({ pathname: '/verify-otp', params: { phoneNumber: identifier } });
          return;
        }

        setApiError(message);
        return;
      }

      const response = await AuthAPI.login({
        emailAddress: identifier,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      await useAuthStore.getState().setTokens({
        accessToken: response.data?.accessToken ?? null,
        refreshToken: response.data?.refreshToken ?? null,
      });

      router.replace('/');
    } catch (error) {
      setApiError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSocialAuth = (_provider: string) => {
    return undefined;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <View style={styles.topBar}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoGlyph}>◌</Text>
          </View>
          <Text style={styles.brandText}>Karibyshoo</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Sign In to Your Account</Text>
          <Text style={styles.subheading}>
            Set up your organization&apos;s visitor and meeting management in minutes.
          </Text>

          {apiError ? <Text style={styles.errorBanner}>{apiError}</Text> : null}

          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email / Phone Number / Username"
                placeholder="Placeholder"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.identifier?.message}
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Password"
                placeholder="********"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.inlineRow}>
            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Remember me" checked={!!value} onChange={onChange} />
              )}
            />
            <Link href="/forgot-password" asChild>
              <Pressable>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Pressable>
            </Link>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleSubmitLogin} disabled={isSubmitting}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Signing in...' : 'Sign In'}</Text>
          </Pressable>

          <View style={styles.socialDividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton} onPress={() => handleSocialAuth('Google')}>
              <Text style={styles.socialText}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => handleSocialAuth('Meta')}>
              <Text style={styles.socialText}>◌</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => handleSocialAuth('X')}>
              <Text style={styles.socialText}>X</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Link href="/create-account" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Sign up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: designTokens.surface,
    paddingVertical: designTokens.space8,
  },
  shell: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: designTokens.surface,
    minHeight: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.space5,
    paddingTop: 12,
    paddingBottom: designTokens.space4,
    marginBottom: designTokens.space2,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: designTokens.radiusMd,
    backgroundColor: designTokens.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.space2,
  },
  logoGlyph: {
    color: designTokens.white,
    fontSize: 18,
    fontWeight: '700',
  },
  brandText: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#f8f8fb',
    borderRadius: designTokens.radiusLg,
    paddingHorizontal: designTokens.space5,
    paddingTop: designTokens.space6,
    paddingBottom: designTokens.space4,
    marginHorizontal: designTokens.space4,
  },
  heading: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: '700',
    color: designTokens.text,
    marginBottom: designTokens.space2,
  },
  subheading: {
    textAlign: 'center',
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    lineHeight: 22,
    marginBottom: designTokens.space6,
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    color: '#B42318',
    borderRadius: designTokens.radiusMd,
    paddingHorizontal: designTokens.space3,
    paddingVertical: designTokens.space2,
    marginBottom: designTokens.space4,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.space4,
  },
  forgotPassword: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeSm,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space2,
    marginBottom: designTokens.space5,
  },
  primaryButtonText: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '600',
  },
  socialDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.space4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d9d9dd',
  },
  dividerText: {
    marginHorizontal: designTokens.space3,
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.space3,
    marginBottom: designTokens.space5,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: designTokens.radiusMd,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.space2,
  },
  footerText: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
  },
  footerLink: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeSm,
    fontWeight: '700',
  },
});
