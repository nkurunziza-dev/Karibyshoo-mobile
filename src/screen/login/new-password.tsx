import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthAPI, { getApiErrorMessage } from '@/authApi';
import PasswordInput from '@/components/ui/PasswordInput';
import { designTokens } from '@/constants/theme';

const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type NewPasswordValues = z.infer<typeof newPasswordSchema>;

export default function NewPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string; phoneNumber?: string; otp?: string }>();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(newPasswordSchema),
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
          <Text style={styles.heading}>Create a New Password</Text>
          <Text style={styles.subheading}>Enter a new password to secure your account</Text>

          {apiError ? <Text style={styles.errorBanner}>{apiError}</Text> : null}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="New password"
                placeholder="enter your password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Confirm New Password"
                placeholder="enter your password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(async (values) => {
              try {
                setApiError(null);
                const email = typeof params.email === 'string' ? params.email : undefined;
                const phoneNumber = typeof params.phoneNumber === 'string' ? params.phoneNumber : undefined;
                const otp = typeof params.otp === 'string' ? params.otp : undefined;

                await AuthAPI.confirmPasswordReset({
                  emailAddress: email,
                  phoneNumber,
                  otp: otp ?? '',
                  newPassword: values.password,
                  confirmPassword: values.confirmPassword,
                });

                router.push({ pathname: '/login', params: { success: 'Password reset successful — please sign in' } });
              } catch (error) {
                setApiError(getApiErrorMessage(error));
              }
            })}
          >
            <Text style={styles.primaryButtonText}>Submit</Text>
          </Pressable>

          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.backLink}>Back to Login</Text>
            </Pressable>
          </Link>
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.space5,
    paddingTop: 12,
    paddingBottom: designTokens.space4,
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
    marginBottom: designTokens.space5,
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
  fieldSpacing: {
    marginBottom: designTokens.space4,
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space4,
    marginBottom: designTokens.space4,
  },
  primaryButtonText: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '700',
  },
  backLink: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeMd,
    textAlign: 'center',
    fontWeight: '600',
  },
});
