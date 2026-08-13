import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';
import { useOtpVerification } from '@/hooks/useOtpVerification';
import AuthAPI, { getApiErrorMessage } from '@/authApi';
import authStore from '@/authStore';

const verifyOtpSchema = z.object({
  code: z.string().min(6, 'Enter the 6-digit code.'),
});

type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ phoneNumber?: string }>();
  const [apiError, setApiError] = useState<string | null>(null);
  const { code, setCode, formattedTime, error, sendCode, resendCode, verifyCode, clearError } = useOtpVerification({
    expirySeconds: 90,
  });

  const phoneNumber = typeof params.phoneNumber === 'string' ? params.phoneNumber : '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    defaultValues: { code: '' },
    resolver: zodResolver(verifyOtpSchema),
  });

  useEffect(() => {
    if (!phoneNumber) {
      setApiError('Phone number is missing.');
      return;
    }

    void sendCode(phoneNumber).catch(() => {
      setApiError('Unable to send the OTP right now.');
    });
  }, [phoneNumber, sendCode]);

  const bannerMessage = useMemo(() => apiError ?? error ?? null, [apiError, error]);

  const handleResend = async () => {
    if (!phoneNumber) {
      setApiError('Phone number is missing.');
      return;
    }

    try {
      setApiError(null);
      clearError();
      await AuthAPI.loginWithPhoneNumber({ phoneNumber });
      await resendCode(phoneNumber);
    } catch (submitError) {
      setApiError(getApiErrorMessage(submitError));
    }
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
          <Text style={styles.heading}>Verify Your Number</Text>
          <Text style={styles.subheading}>Enter the six digits code sent to {phoneNumber || 'your phone number'}.</Text>

          {bannerMessage ? <Text style={styles.banner}>{bannerMessage}</Text> : null}

          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Verification code"
                placeholder="Enter 6-digit code"
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  const normalized = text.replace(/\D/g, '').slice(0, 6);
                  onChange(normalized);
                  setCode(normalized);
                  if (apiError) setApiError(null);
                }}
                keyboardType="number-pad"
                autoCapitalize="none"
                error={errors.code?.message || undefined}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Text style={styles.metaText}>
            <Text style={styles.inlineLink} onPress={handleResend}>Resend</Text>
            <Text> code in {formattedTime}</Text>
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(async (values) => {
              if (!phoneNumber) {
                setApiError('Phone number is missing.');
                return;
              }

              const isValid = await verifyCode(values.code);
              if (!isValid) {
                return;
              }

              try {
                setApiError(null);
                clearError();
                const response = await AuthAPI.validateLoginOtp({ phoneNumber, otp: values.code });
                const accessToken = response.data.accessToken;
                const refreshToken = response.data.refreshToken;
                if (accessToken && refreshToken) {
                  await authStore.getState().setTokens({ accessToken, refreshToken });
                  router.replace('/' as any);
                  return;
                }
                setApiError('Login succeeded but no tokens were returned.');
              } catch (submitError) {
                setApiError(getApiErrorMessage(submitError));
              }
            })}
          >
            <Text style={styles.primaryButtonText}>Verify</Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: designTokens.text,
    marginBottom: designTokens.space2,
  },
  subheading: {
    textAlign: 'center',
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    lineHeight: 22,
    marginBottom: designTokens.space4,
  },
  banner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: designTokens.radiusSm,
    color: '#991B1B',
    padding: designTokens.space3,
    marginBottom: designTokens.space3,
  },
  fieldSpacing: {
    marginBottom: designTokens.space2,
  },
  metaText: {
    textAlign: 'center',
    color: designTokens.text,
    fontSize: designTokens.fontSizeMd,
    marginBottom: designTokens.space4,
  },
  inlineLink: {
    color: designTokens.primary,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space3,
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
