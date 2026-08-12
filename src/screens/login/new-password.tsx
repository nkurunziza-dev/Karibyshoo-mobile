import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PasswordInput from '@/components/ui/PasswordInput';
import { designTokens } from '@/constants/theme';

const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match.',
  });

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export default function NewPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(newPasswordSchema),
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <Text style={styles.heading}>Create a new password</Text>
        <Text style={styles.subheading}>
          Protect your account with a strong password. Use at least 8 characters.
        </Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label="New password"
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

        <Pressable style={styles.primaryButton} onPress={handleSubmit(() => undefined)}>
          <Text style={styles.primaryButtonText}>Reset password</Text>
        </Pressable>

        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Back to Sign in</Text>
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
    borderColor: designTokens.border,
    borderWidth: 1,
    backgroundColor: designTokens.surface,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
  },
});
