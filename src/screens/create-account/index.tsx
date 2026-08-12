import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';

export default function CreateAccountChooserScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.shell}>
        <Text style={styles.heading}>Create an Account</Text>
        <Text style={styles.subheading}>Choose the account type that best matches your business needs.</Text>

        <Link href="/create-account/company" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>Company Account</Text>
            <Text style={styles.cardDescription}>Set up your organization with admins, teams, and company visitor workflows.</Text>
          </Pressable>
        </Link>

        <Link href="/create-account/individual" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>Individual Account</Text>
            <Text style={styles.cardDescription}>Manage visitors and meetings for a single business or freelancer.</Text>
          </Pressable>
        </Link>

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
    padding: designTokens.space6,
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
  card: {
    backgroundColor: designTokens.white,
    borderRadius: designTokens.radiusLg,
    borderWidth: 1,
    borderColor: designTokens.border,
    padding: designTokens.space5,
    marginBottom: designTokens.space4,
  },
  cardTitle: {
    fontSize: designTokens.fontSizeLg,
    fontWeight: '700',
    color: designTokens.text,
    marginBottom: designTokens.space2,
  },
  cardDescription: {
    fontSize: designTokens.fontSizeMd,
    color: designTokens.textSecondary,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.space4,
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
