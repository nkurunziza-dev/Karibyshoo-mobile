import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';
import { useOtpVerification } from '@/hooks/useOtpVerification';

const verifyEmailSchema = z.object({
  code: z.string().min(6, 'Enter the 6-digit code.'),
});

type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailScreen() {
  const { code, setCode, status, error, formattedTime, sendCode, verifyCode, resendCode } =
    useOtpVerification({ expirySeconds: 38 });
  const [submittedAt, setSubmittedAt] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailValues>({
    defaultValues: { code: '' },
    resolver: zodResolver(verifyEmailSchema),
  });

  useEffect(() => {
    void sendCode('example@gmail.com');
  }, [sendCode]);

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
          <Text style={styles.heading}>Verify Email Address</Text>
          <Text style={styles.subheading}>Enter the six digits code sent to your email address example@gmail.com</Text>

          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Code"
                placeholder="Enter verification code here"
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  const digits = text.replace(/\D/g, '').slice(0, 6);
                  onChange(digits);
                  setCode(digits);
                }}
                keyboardType="number-pad"
                autoCapitalize="none"
                error={errors.code?.message || error || undefined}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Text style={styles.metaText}>
            <Text style={styles.inlineLink} onPress={() => void resendCode('example@gmail.com')}>
              Didn&apos;t get code?
            </Text>
            <Text> Resend</Text>
          </Text>

          <Text style={styles.timerText}>Code expires in {formattedTime}</Text>

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(async (values) => {
              const isVerified = await verifyCode(values.code);
              if (isVerified) {
                router.push('/new-password');
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
  fieldSpacing: {
    marginBottom: designTokens.space2,
  },
  metaText: {
    textAlign: 'center',
    marginTop: designTokens.space1,
    color: designTokens.text,
    fontSize: designTokens.fontSizeMd,
  },
  inlineLink: {
    color: designTokens.primary,
    fontWeight: '700',
  },
  timerText: {
    textAlign: 'center',
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    marginBottom: designTokens.space4,
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
