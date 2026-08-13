import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AuthAPI, getAuthErrorMessage } from '@/api/auth';
import Checkbox from '@/components/ui/Checkbox';
import PasswordInput from '@/components/ui/PasswordInput';
import PhoneInput from '@/components/ui/PhoneInput';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';

const companySchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required.'),
    adminName: z.string().min(1, 'Admin name is required.'),
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

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyAccountScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    defaultValues: {
      companyName: '',
      adminName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    resolver: zodResolver(companySchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.companyName);
      formData.append('adminName', values.adminName);
      formData.append('emailAddress', values.email);
      formData.append('primaryPhoneNumber', values.phone.replace(/\D/g, ''));
      formData.append('acronym', '');
      formData.append('countryId', '1');
      formData.append('physicalAddress', '');
      formData.append('tradingLicenseNumber', '');
      formData.append('registrationNumber', '');
      formData.append('postalAddress', '');
      formData.append('website', '');

      const response = await AuthAPI.createCompany(formData);
      const companyId = (response.data as any)?.id ?? (response.data as any)?.companyId ?? null;

      router.push({
        pathname: '/verify-email',
        params: {
          email: values.email,
          companyId: companyId ? String(companyId) : '',
        },
      });
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
      // Inline banner handling remains in the screen as a future enhancement.
      if (errorMessage) {
        return;
      }
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
          <Text style={styles.heading}>Create Your Company Account</Text>
          <Text style={styles.subheading}>Set up your organization&apos;s visitor and meeting management in minutes.</Text>

          <Controller
            name="companyName"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Company name"
                placeholder="Placeholder"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.companyName?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <Controller
            name="adminName"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Admin name"
                placeholder="Placeholder"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.adminName?.message}
                containerStyle={styles.fieldSpacing}
              />
            )}
          />

          <View style={styles.twoColumnRow}>
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
                  containerStyle={styles.columnField}
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
                  containerStyle={styles.columnField}
                />
              )}
            />
          </View>

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

          <Pressable style={styles.primaryButton} onPress={onSubmit}>
            <Text style={styles.primaryButtonText}>Create an Account</Text>
          </Pressable>

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
