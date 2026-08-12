import { useEffect } from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';
import useOtpVerification from '@/hooks/useOtpVerification';

export default function VerifyEmailScreen() {
  const { code, setCode, resend, timer, verifying, error } = useOtpVerification();

  useEffect(() => {
    setCode('');
  }, [setCode]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <Text style={styles.heading}>Verify Email</Text>
        <Text style={styles.subheading}>
          Enter the 6-digit code we sent to your inbox.
        </Text>

        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>6-digit code</Text>
          <Text style={styles.otpInput}>{code || '– – – – – –'}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn’t receive a code?</Text>
          <Pressable style={styles.resendButton} onPress={resend} disabled={timer > 0 || verifying}>
            <Text style={styles.resendButtonText}>{timer > 0 ? `Resend in ${timer}s` : 'Resend code'}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => undefined}>
          <Text style={styles.primaryButtonText}>{verifying ? 'Verifying…' : 'Verify Email'}</Text>
        </Pressable>

        <Link href="/new-password" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Continue without verifying</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: designTokens.surface,
    paddingVertical: designTokens.space8,
    paddingHorizontal: designTokens.space4,
  },
  shell: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: designTokens.surfaceAlt,
    borderRadius: designTokens.radiusLg,
    padding: designTokens.space5,
  },
  heading: {
    fontSize: designTokens.fontSizeXl2,
    fontWeight: '700',
    color: designTokens.text,
    marginBottom: designTokens.space2,
    textAlign: 'center',
  },
  subheading: {
    fontSize: designTokens.fontSizeMd,
    color: designTokens.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: designTokens.space6,
  },
  otpContainer: {
    backgroundColor: designTokens.white,
    borderRadius: designTokens.radiusMd,
    borderWidth: 1,
    borderColor: designTokens.border,
    padding: designTokens.space4,
    marginBottom: designTokens.space4,
  },
  otpLabel: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
    marginBottom: designTokens.space2,
  },
  otpInput: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeXl,
    letterSpacing: 10,
    textAlign: 'center',
    lineHeight: 40,
  },
  errorText: {
    color: designTokens.destructive,
    marginBottom: designTokens.space3,
    textAlign: 'center',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: designTokens.space5,
  },
  resendText: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
    marginBottom: designTokens.space2,
  },
  resendButton: {
    paddingHorizontal: designTokens.space3,
    paddingVertical: designTokens.space2,
  },
  resendButtonText: {
    color: designTokens.primary,
    fontWeight: '700',
    fontSize: designTokens.fontSizeSm,
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.space4,
  },
  primaryButtonText: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
  },
  secondaryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: designTokens.space3,
  },
  secondaryButtonText: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
  },
});
