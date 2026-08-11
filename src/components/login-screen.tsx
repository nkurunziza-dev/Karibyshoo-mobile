import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Checkbox from '@/components/ui/Checkbox';
import PasswordInput from '@/components/ui/PasswordInput';
import TextField from '@/components/ui/TextField';
import { designTokens } from '@/constants/theme';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Enter your email, phone, or username.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(loginSchema),
  });

  const handleSocialAuth = (provider: string) => {
    console.log(`${provider} auth placeholder`);
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
          <Text style={styles.heading}>Sign In to Your Account</Text>
          <Text style={styles.subheading}>
            Set up your organization&apos;s visitor and meeting management in minutes.
          </Text>

          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email / Phone Number / Username"
                placeholder="Placeholder"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.identifier?.message}
                autoCapitalize="none"
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

          <View style={styles.inlineRow}>
            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Remember me" checked={!!value} onChange={onChange} />
              )}
            />
            <Link href="/forgot-password" asChild>
              <Pressable>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Pressable>
            </Link>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleSubmit(() => undefined)}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </Pressable>

          <View style={styles.socialDividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton} onPress={() => handleSocialAuth('Google')}>
              <Text style={styles.socialText}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => handleSocialAuth('Meta')}>
              <Text style={styles.socialText}>◌</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => handleSocialAuth('X')}>
              <Text style={styles.socialText}>X</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Link href="/create-account" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Sign up</Text>
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
    minHeight: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.space5,
    paddingTop: 12,
    paddingBottom: designTokens.space4,
    marginBottom: designTokens.space2,
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
    fontSize: 34,
    fontWeight: '700',
    color: designTokens.text,
    marginBottom: designTokens.space2,
  },
  subheading: {
    textAlign: 'center',
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    lineHeight: 22,
    marginBottom: designTokens.space6,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.space4,
  },
  forgotPassword: {
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
    marginTop: designTokens.space2,
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
    marginTop: designTokens.space2,
  },
  footerText: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
  },
  footerLink: {
    color: designTokens.primary,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
    marginLeft: designTokens.space1,
  },
});
