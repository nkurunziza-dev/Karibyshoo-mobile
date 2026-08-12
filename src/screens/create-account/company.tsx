import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Checkbox from '@/components/ui/Checkbox';
import PasswordInput from '@/components/ui/PasswordInput';
import PhoneInput from '@/components/ui/PhoneInput';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';

const companySchema = z
  .object({
    companyName: z.string().min(1, 'Enter your company name.'),
    adminName: z.string().min(1, 'Enter the administrator name.'),
    email: z.string().email('Enter a valid email address.'),
    phone: z.string().min(1, 'Enter a phone number.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match.',
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
      acceptTerms: false,
    },
    resolver: zodResolver(companySchema),
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <Text style={styles.heading}>Create Company Account</Text>
        <Controller
          control={control}
          name="companyName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Company name"
              placeholder="Acme Corp"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.companyName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="adminName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Admin name"
              placeholder="Jane Doe"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.adminName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Email"
              placeholder="you@company.com"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <PhoneInput
              label="Phone"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.phone?.message}
            />
          )}
        />
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
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label="Confirm password"
              placeholder="********"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field: { value, onChange } }) => (
            <Checkbox
              label="I agree to the terms and conditions"
              checked={!!value}
              onChange={onChange}
            />
          )}
        />
        <Pressable style={styles.primaryButton} onPress={handleSubmit(() => undefined)}>
          <Text style={styles.primaryButtonText}>Create account</Text>
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
    marginBottom: designTokens.space4,
    textAlign: 'center',
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
    fontSize: designTokens.fontSizeMd,
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
    fontWeight: '700',
    marginLeft: designTokens.space2,
    fontSize: designTokens.fontSizeMd,
  },
});
