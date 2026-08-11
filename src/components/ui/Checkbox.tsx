import { Pressable, StyleSheet, Text, View } from 'react-native';

import { designTokens } from '@/constants/theme';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <Pressable onPress={() => onChange(!checked)} style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.space2,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: designTokens.radiusSm,
    borderWidth: 1.5,
    borderColor: designTokens.border,
    backgroundColor: designTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    backgroundColor: designTokens.primary,
    borderColor: designTokens.primary,
  },
  checkmark: {
    color: designTokens.white,
    fontSize: designTokens.fontSizeSm,
    lineHeight: 18,
    fontWeight: '700',
  },
  label: {
    color: designTokens.text,
    fontSize: designTokens.fontSizeMd,
    flexShrink: 1,
  },
});
