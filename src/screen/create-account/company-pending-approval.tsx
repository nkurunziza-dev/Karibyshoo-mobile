import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';

export default function CompanyPendingApprovalScreen() {
  return (
    <View style={styles.shell}>
      <View style={styles.card}>
        <Text style={styles.title}>Your company account is pending approval.</Text>
        <Text style={styles.copy}>You&apos;ll be notified once an admin reviews it.</Text>

        <Pressable style={styles.primaryButton} onPress={() => router.replace('/login')}>
          <Text style={styles.primaryButtonText}>Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: designTokens.surface,
    justifyContent: 'center',
    padding: designTokens.space5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: designTokens.radiusLg,
    padding: designTokens.space5,
  },
  title: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeXl,
    fontWeight: '700',
    marginBottom: designTokens.space2,
    textAlign: 'center',
  },
  copy: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeMd,
    textAlign: 'center',
    marginBottom: designTokens.space5,
  },
  primaryButton: {
    backgroundColor: designTokens.primary,
    borderRadius: designTokens.radiusMd,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '600',
  },
});
