import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';

export default function CheckEmailScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.heading}>Check your email</Text>
        <Text style={styles.subheading}>
          We sent a password reset link to your inbox. Open your email to continue.
        </Text>

        <Pressable style={styles.primaryButton} onPress={() => undefined}>
          <Text style={styles.primaryButtonText}>Open Mail</Text>
        </Pressable>

        <Text style={styles.helperText}>If you don’t see the email, check your spam folder.</Text>

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
    padding: designTokens.space6,
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 88,
    backgroundColor: designTokens.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.space5,
  },
  icon: {
    fontSize: 36,
    color: designTokens.primary,
    fontWeight: '700',
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
    width: '100%',
    marginBottom: designTokens.space4,
  },
  primaryButtonText: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
  },
  helperText: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
    textAlign: 'center',
    marginBottom: designTokens.space4,
  },
  secondaryButton: {
    borderColor: designTokens.border,
    borderWidth: 1,
    backgroundColor: designTokens.surface,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeMd,
    fontWeight: '700',
  },
});
