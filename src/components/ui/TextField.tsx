import { Ionicons } from '@expo/vector-icons';
import { forwardRef, type ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { designTokens } from '@/constants/theme';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  rightAdornment?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, rightAdornment, containerStyle, style, ...props },
  ref,
) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
        <TextInput
          ref={ref}
          placeholderTextColor={designTokens.textMuted}
          style={[styles.input, style]}
          {...props}
        />
        {rightAdornment ? <View style={styles.adornment}>{rightAdornment}</View> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

export default TextField;

export function InlineAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.inlineAction}>{label}</Text>
    </Pressable>
  );
}

export function InputIcon({ name, onPress }: { name: keyof typeof Ionicons.glyphMap; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.iconButton} hitSlop={8}>
      <Ionicons name={name} size={20} color={designTokens.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: designTokens.fontSizeMd,
    fontWeight: '600',
    color: designTokens.text,
    marginBottom: designTokens.space2,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: designTokens.border,
    borderRadius: designTokens.radiusMd,
    backgroundColor: designTokens.white,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: designTokens.error,
  },
  input: {
    flex: 1,
    fontSize: designTokens.fontSizeMd,
    color: designTokens.text,
    paddingHorizontal: designTokens.space4,
    paddingVertical: designTokens.space3,
    minHeight: 52,
  },
  adornment: {
    paddingRight: designTokens.space3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: designTokens.space2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineAction: {
    fontSize: designTokens.fontSizeSm,
    fontWeight: '600',
    color: designTokens.primary,
  },
  errorText: {
    marginTop: designTokens.space1,
    fontSize: designTokens.fontSizeSm,
    color: designTokens.error,
  },
});
