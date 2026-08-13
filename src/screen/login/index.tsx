import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import AuthAPI, { getApiErrorMessage } from '@/authApi';
import authStore from '@/authStore';
import Checkbox from '@/components/ui/Checkbox';
import PasswordInput from '@/components/ui/PasswordInput';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';

const isPhoneIdentifier = (value: string) => value.trim().startsWith('+') || /^\d+$/.test(value.trim());

const loginSchema = z
  .object({
    identifier: z.string().min(1, 'Enter your email, phone, or username.'),
    password: z.string().optional(),
    rememberMe: z.boolean().default(false),
  })
  .refine(
    (values) => {
      if (isPhoneIdentifier(values.identifier)) {
        return true;
      }
      return !!values.password && values.password.length >= 8;
    },
    {
      message: 'Password must be at least 8 characters.',
      path: ['password'],
    },
  );

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const params = useLocalSearchParams<{ success?: string }>();
  const [apiError, setApiError] = useState<string | null>(null);
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
    resolver: zodResolver(loginSchema) as any,
  });

  const identifierValue = useWatch({ control, name: 'identifier' });
  const isPhoneLogin = isPhoneIdentifier(identifierValue ?? '');
  const successMessage = typeof params.success === 'string' ? params.success : null;

  const handleSocialAuth = (provider: string) => {
    void provider;
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setApiError(null);

      const normalizedIdentifier = values.identifier.trim();
      if (isPhoneLogin) {
        await AuthAPI.loginWithPhoneNumber({ phoneNumber: normalizedIdentifier });
        router.push({ pathname: '/verify-otp', params: { phoneNumber: normalizedIdentifier } } as any);
        return;
      }

      const password = values.password ?? '';
      const response = await AuthAPI.login({
        emailAddress: normalizedIdentifier,
        password,
        rememberMe: values.rememberMe,
      });

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      if (!accessToken || !refreshToken) {
        setApiError('Login succeeded but no tokens were returned.');
        return;
      }

      await authStore.getState().setTokens({ accessToken, refreshToken });
      router.replace('/' as any);
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    }
  });

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

          {successMessage ? <Text style={styles.successBanner}>{successMessage}</Text> : null}
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

          {!isPhoneLogin ? (
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
          ) : null}

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

          <Pressable style={styles.primaryButton} onPress={onSubmit}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
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
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: designTokens.radiusSm,
    color: '#166534',
    padding: designTokens.space3,
    marginBottom: designTokens.space3,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: designTokens.radiusSm,
    color: '#991B1B',
    padding: designTokens.space3,
    marginBottom: designTokens.space3,
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
    fontWeight: '700',
  },
  socialDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.space4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: designTokens.border,
  },
  dividerText: {
    marginHorizontal: designTokens.space2,
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: designTokens.space2,
    marginBottom: designTokens.space4,
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderRadius: designTokens.radiusMd,
    borderWidth: 1,
    borderColor: designTokens.border,
    backgroundColor: designTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    fontSize: 20,
    color: designTokens.text,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space2,
  },
  footerText: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
  },
  footerLink: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
    marginLeft: designTokens.space1,
  },
});
