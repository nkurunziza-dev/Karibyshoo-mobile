import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';

export default function CreateAccountChooserScreen() {
  const [selectedType, setSelectedType] = useState<'company' | 'individual'>('company');

  return (
    <View style={styles.shell}>
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoGlyph}>◌</Text>
        </View>
        <Text style={styles.brandText}>Karibyshoo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Create an Account</Text>
        <Text style={styles.subheading}>Choose your account type to get started</Text>

        <View style={styles.optionRow}>
          <Pressable
            onPress={() => setSelectedType('company')}
            style={[styles.optionCard, selectedType === 'company' && styles.optionCardActive]}
          >
            <Text style={styles.optionIcon}>▣</Text>
            <Text style={styles.optionTitle}>Company Account</Text>
            <Text style={styles.optionCopy}>For organizations managing visitors, meetings, and parking.</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedType('individual')}
            style={[styles.optionCard, selectedType === 'individual' && styles.optionCardActive]}
          >
            <Text style={styles.optionIcon}>◔</Text>
            <Text style={styles.optionTitle}>Individual</Text>
            <Text style={styles.optionCopy}>For visitors registering with a company ID.</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            const route =
            selectedType === 'company'
            ? '/create-account/company'
            : '/create-account/individual';
            router.push(route as any);
          }}
        >
          <Text style={styles.primaryButtonText}>Create an Account</Text>
        </Pressable>
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
    marginBottom: designTokens.space5,
  },
  optionRow: {
    flexDirection: 'row',
    gap: designTokens.space3,
    marginBottom: designTokens.space5,
  },
  optionCard: {
    flex: 1,
    minHeight: 180,
    borderWidth: 1,
    borderColor: designTokens.border,
    borderRadius: designTokens.radiusMd,
    padding: designTokens.space4,
    backgroundColor: designTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCardActive: {
    borderColor: designTokens.primary,
    shadowColor: designTokens.softShadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  optionIcon: {
    color: designTokens.primary,
    fontSize: 28,
    marginBottom: designTokens.space3,
  },
  optionTitle: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeLg,
    fontWeight: '700',
    marginBottom: designTokens.space2,
  },
  optionCopy: {
    color: designTokens.textSecondary,
    fontSize: designTokens.fontSizeSm,
    textAlign: 'center',
    lineHeight: 20,
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
    fontWeight: '700',
  },
});
