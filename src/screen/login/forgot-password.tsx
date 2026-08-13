import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthAPI, { getApiErrorMessage } from '@/authApi';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';

const createForgotPasswordSchema = (usePhone: boolean) =>
  z.object({
    contact: z
      .string()
      .trim()
      .refine(
        (value) => {
          if (usePhone) {
            return value.length >= 8;
          }
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        {
          message: usePhone ? 'Enter a valid phone number.' : 'Enter a valid email address.',
        },
      ),
  });

type ForgotPasswordValues = { contact: string };

export default function ForgotPasswordScreen() {
  const [usePhone, setUsePhone] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const schema = createForgotPasswordSchema(usePhone);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    defaultValues: { contact: '' },
    resolver: zodResolver(schema),
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
          <Text style={styles.heading}>Forgot your password?</Text>
          <Text style={styles.subheading}>
            Don&apos;t worry, we&apos;ve all been there! Just drop your email below, and we&apos;ll send you a link to help reset your password.
          </Text>

          {apiError ? <Text style={styles.errorBanner}>{apiError}</Text> : null}

          <Controller
            control={control}
            name="contact"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={usePhone ? 'Phone Number' : 'Email'}
                placeholder={usePhone ? 'enter your phone number' : 'enter your email'}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType={usePhone ? 'phone-pad' : 'email-address'}
                error={errors.contact?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Pressable style={styles.toggleLink} onPress={() => setUsePhone((value) => !value)}>
            <Text style={styles.toggleText}>{usePhone ? 'Use Email' : 'Use Phone'}</Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(async (values) => {
              try {
                setApiError(null);
                const payload = usePhone
                  ? { phoneNumber: values.contact.trim() }
                  : { emailAddress: values.contact.trim() };
                await AuthAPI.requestPasswordReset(payload);
                router.push({ pathname: '/check-email', params: { email: usePhone ? '' : values.contact.trim() } });
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
    fontSize: 32,
    fontWeight: '700',
    color: designTokens.text,
    marginBottom: designTokens.space2,
  },
  subheading: {
    textAlign: 'center',
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    lineHeight: 24,
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
  toggleLink: {
    alignSelf: 'flex-end',
    marginBottom: designTokens.space4,
  },
  toggleText: {
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
