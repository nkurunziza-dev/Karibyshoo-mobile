import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';

export default function CheckEmailScreen() {
  return (
    <View style={styles.shell}>
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoGlyph}>◌</Text>
        </View>
        <Text style={styles.brandText}>Karibyshoo</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Text style={styles.mailIcon}>✉</Text>
        </View>

        <Text style={styles.heading}>Check your Email</Text>
        <Text style={styles.subheading}>We&apos;ve sent a verification code to your example@gmail.com</Text>

        <Pressable style={styles.primaryButton} onPress={() => undefined}>
          <Text style={styles.primaryButtonText}>Open Mail</Text>
        </Pressable>

        <Link href="/login" asChild>
          <Pressable>
            <Text style={styles.backLink}>Back to Login</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: designTokens.surface,
    paddingTop: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.space5,
    paddingBottom: designTokens.space4,
    marginLeft: designTokens.space4,
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
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: designTokens.radiusMd,
    backgroundColor: designTokens.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: designTokens.space4,
  },
  mailIcon: {
    color: designTokens.white,
    fontSize: 28,
    fontWeight: '700',
  },
  heading: {
    textAlign: 'center',
    fontSize: 36,
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
  primaryButton: {
    backgroundColor: designTokens.primary,
    height: 52,
    borderRadius: designTokens.radiusMd,
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
