import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <Text style={styles.heading}>Forgot Password</Text>
        <Text style={styles.subheading}>
          Enter the email address associated with your account and we&apos;ll send instructions to reset your password.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Email"
              placeholder="you@example.com"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Pressable style={styles.primaryButton} onPress={handleSubmit(() => undefined)}>
          <Text style={styles.primaryButtonText}>Submit</Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remembered your password?</Text>
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
    marginBottom: designTokens.space2,
    textAlign: 'center',
  },
  subheading: {
    fontSize: designTokens.fontSizeMd,
    color: designTokens.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: designTokens.space6,
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space2,
    marginBottom: designTokens.space5,
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
