import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthAPI, { getApiErrorMessage } from '@/authApi';
import Checkbox from '@/components/ui/Checkbox';
import PasswordInput from '@/components/ui/PasswordInput';
import PhoneInput from '@/components/ui/PhoneInput';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';
import useSignupFlowStore from '@/signupFlowStore';

const individualSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Enter a valid email.'),
    phone: z.string().min(8, 'Enter a valid phone number.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
    termsAccepted: z.boolean().refine((value) => value, 'Accept the terms to continue.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type IndividualFormValues = z.infer<typeof individualSchema>;

export default function IndividualAccountScreen() {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IndividualFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    resolver: zodResolver(individualSchema),
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
          <Text style={styles.heading}>Create Your Individual Account</Text>
          <Text style={styles.subheading}>Register to track your visits and access seamless entry.</Text>

          {apiError ? <Text style={styles.errorBanner}>{apiError}</Text> : null}

          <View style={styles.twoColumnRow}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Firstname"
                  placeholder="Placeholder"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.firstName?.message}
                  containerStyle={styles.columnField}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Lastname"
                  placeholder="Placeholder"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.lastName?.message}
                  containerStyle={styles.columnField}
                />
              )}
            />
          </View>

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email"
                placeholder="Placeholder"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.email?.message}
                autoCapitalize="none"
                keyboardType="email-address"
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <PhoneInput
                label="Phone Number"
                placeholder="Placeholder"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.phone?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Password"
                placeholder="************"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Confirm Password"
                placeholder="************"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Controller
            name="termsAccepted"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                label="I hereby agree to all Terms & Condition"
                checked={value}
                onChange={onChange}
              />
            )}
          />

          <Pressable
            style={styles.primaryButton}
            onPress={handleSubmit(async (values) => {
              try {
                setApiError(null);

                const payload = {
                  emailAddress: values.email.trim(),
                  firstName: values.firstName.trim(),
                  lastName: values.lastName.trim(),
                  phoneNumber: values.phone.trim(),
                  gender: 'OTHER' as const,
                };

                const response = await AuthAPI.createVisitor(payload);
                const id = (response.data as { id?: number | string; accountId?: number | string; userId?: number | string } | undefined)?.id;

                useSignupFlowStore.getState().setPending({
                  email: payload.emailAddress,
                  accountId: id,
                  password: values.password,
                });

                router.push({
                  pathname: '/verify-email',
                  params: {
                    email: payload.emailAddress,
                    accountId: id ? String(id) : undefined,
                  },
                });
              } catch (error) {
                setApiError(getApiErrorMessage(error));
              }
            })}
          >
            <Text style={styles.primaryButtonText}>Create an Account</Text>
          </Pressable>

          <View style={styles.socialDividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton} onPress={() => undefined}>
              <Text style={styles.socialText}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => undefined}>
              <Text style={styles.socialText}>◌</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => undefined}>
              <Text style={styles.socialText}>X</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Sign in</Text>
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
    marginBottom: designTokens.space3,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: designTokens.space2,
    marginBottom: designTokens.space3,
  },
  columnField: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space4,
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
  },
  footerText: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
  },
  footerLink: {
    color: designTokens.primary,
    fontWeight: '700',
    marginLeft: designTokens.space1,
    fontSize: designTokens.fontSizeMd,
  },
});
