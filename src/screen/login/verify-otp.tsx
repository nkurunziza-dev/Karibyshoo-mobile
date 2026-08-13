import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthAPI, getAuthErrorMessage } from '@/api/auth';
import { designTokens } from '@/constants/theme';
import { useAuthStore } from '@/store/auth';
import { useOtpVerification } from '@/hooks/useOtpVerification';

export default function LoginOtpScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber?: string }>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { code, setCode, formattedTime, sendCode, resendCode, status, error: otpError } = useOtpVerification({ expirySeconds: 180 });

  const normalizedPhone = useMemo(() => (typeof phoneNumber === 'string' ? phoneNumber : ''), [phoneNumber]);

  const handleSend = async () => {
    if (!normalizedPhone) {
      setError('Phone number is missing.');
      return;
    }

    const sent = await sendCode(normalizedPhone);
    if (sent) {
      await AuthAPI.loginWithPhoneNumber({ phoneNumber: normalizedPhone });
    }
  };

  const handleResend = async () => {
    if (!normalizedPhone) {
      setError('Phone number is missing.');
      return;
    }

    setError(null);
    const sent = await resendCode(normalizedPhone);
    if (sent) {
      await AuthAPI.loginWithPhoneNumber({ phoneNumber: normalizedPhone });
    }
  };

  const handleSubmit = async () => {
    if (!normalizedPhone) {
      setError('Phone number is missing.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await AuthAPI.validateLoginOtp({ phoneNumber: normalizedPhone, otp: code });
      await useAuthStore.getState().setTokens({
        accessToken: response.data?.accessToken ?? null,
        refreshToken: response.data?.refreshToken ?? null,
      });
      router.replace('/');
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.shell}>
      <Text style={styles.title}>Verify Phone Number</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to {normalizedPhone || 'your phone'}</Text>

      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
      {otpError ? <Text style={styles.errorBanner}>{otpError}</Text> : null}

      <TextInput
        value={code}
        onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        placeholder="123456"
        maxLength={6}
        style={styles.otpInput}
      />

      <Pressable style={styles.primaryButton} onPress={handleSubmit} disabled={submitting || code.length !== 6}>
        <Text style={styles.primaryButtonText}>{submitting ? 'Verifying...' : 'Submit'}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleResend} disabled={status === 'sending'}>
        <Text style={styles.secondaryButtonText}>Resend ({formattedTime})</Text>
      </Pressable>

      <Pressable style={styles.textButton} onPress={() => router.push('/login')}>
        <Text style={styles.textButtonText}>Back to login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    paddingHorizontal: designTokens.space5,
    paddingTop: designTokens.space8,
    backgroundColor: designTokens.surface,
  },
  title: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeXl,
    fontWeight: '700',
    marginBottom: designTokens.space2,
  },
  subtitle: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    marginBottom: designTokens.space5,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#d9d9dd',
    backgroundColor: '#fff',
    borderRadius: designTokens.radiusMd,
    padding: designTokens.space3,
    fontSize: designTokens.fontSizeLg,
    letterSpacing: 12,
    textAlign: 'center',
    marginBottom: designTokens.space5,
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.space3,
  },
  primaryButtonText: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.space3,
  },
  secondaryButtonText: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '600',
  },
  textButton: {
    alignItems: 'center',
  },
  textButtonText: {
    color: designTokens.primary,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    color: '#B42318',
    borderRadius: designTokens.radiusMd,
    paddingHorizontal: designTokens.space3,
    paddingVertical: designTokens.space2,
    marginBottom: designTokens.space4,
  },
});
