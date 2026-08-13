import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthAPI, { getApiErrorMessage } from '@/authApi';
import { designTokens } from '@/constants/theme';
import { useOtpVerification } from '@/hooks/useOtpVerification';
import useSignupFlowStore from '@/signupFlowStore';
import TextField from '@/components/ui/TextField';

const verifyEmailSchema = z.object({
  code: z.string().min(6, 'Enter the 6-digit code.'),
});

type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{
    mode?: string;
    email?: string;
    companyId?: string;
    accountId?: string;
    phoneNumber?: string;
  }>();

  const [apiError, setApiError] = useState<string | null>(null);
  const mode = typeof params.mode === 'string' ? params.mode : 'individual';
  const email = typeof params.email === 'string' ? params.email : '';
  const phoneNumber = typeof params.phoneNumber === 'string' ? params.phoneNumber : '';
  const companyId = typeof params.companyId === 'string' ? params.companyId : undefined;
  const accountId = typeof params.accountId === 'string' ? params.accountId : undefined;

  const { setCode, error, formattedTime, sendCode, verifyCode, resendCode } = useOtpVerification({
    expirySeconds: 90,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailValues>({
    defaultValues: { code: '' },
    resolver: zodResolver(verifyEmailSchema),
  });

  useEffect(() => {
    const destination = email || phoneNumber;
    if (!destination) return;
    void sendCode(destination);
  }, [email, phoneNumber, sendCode]);

  const handleResend = async () => {
    try {
      setApiError(null);
      if (mode === 'reset') {
        await AuthAPI.requestPasswordReset({
          emailAddress: email || undefined,
          phoneNumber: phoneNumber || undefined,
        });
      } else {
        await AuthAPI.resendOtp({
          emailAddress: email || undefined,
          companyId: companyId ? Number(companyId) : undefined,
        });
      }
      await resendCode(email || phoneNumber || '');
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
          <Text style={styles.heading}>
            {mode === 'reset' ? 'Verify Reset Code' : 'Verify Email Address'}
          </Text>
          <Text style={styles.subheading}>
            {mode === 'reset'
              ? `Enter the six digits code sent to ${email || phoneNumber || 'your contact'}`
              : `Enter the six digits code sent to ${email || 'your email address'}`}
          </Text>

          {apiError || error ? <Text style={styles.banner}>{apiError ?? error ?? ''}</Text> : null}

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
            <Text style={styles.inlineLink} onPress={handleResend}>Didn&apos;t get code?</Text>
            <Text> Resend</Text>
          </Text>

          <Text style={styles.timerText}>Code expires in {formattedTime}</Text>

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(async (values) => {
              const otp = values.code;
              if (!otp || otp.length !== 6) {
                setApiError('Enter a valid 6-digit code.');
                return;
              }

              try {
                setApiError(null);
                const isVerified = await verifyCode(otp);
                if (!isVerified) {
                  return;
                }

                if (mode === 'reset') {
                  router.push({
                    pathname: '/new-password',
                    params: {
                      email: email || '',
                      phoneNumber: phoneNumber || '',
                      otp,
                    },
                  });
                  return;
                }

                await AuthAPI.verifyCompanyEmail({
                  emailAddress: email || undefined,
                  otp,
                  companyId: companyId ? Number(companyId) : undefined,
                });

                if (mode === 'company') {
                  router.push('/create-account/company-pending-approval' as any);
                  return;
                }

                const pendingPassword = useSignupFlowStore.getState().password;
                if (!pendingPassword) {
                  setApiError('No password was prepared for this account.');
                  return;
                }

                await AuthAPI.createPassword({
                  newPassword: pendingPassword,
                  confirmPassword: pendingPassword,
                  otp,
                  companyId: companyId ? Number(companyId) : undefined,
                  userId: accountId ? Number(accountId) : undefined,
                });

                useSignupFlowStore.getState().clear();
                router.push({ pathname: '/login', params: { success: 'Account verified — please sign in' } } as any);
              } catch (submitError) {
                setApiError(getApiErrorMessage(submitError));
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
