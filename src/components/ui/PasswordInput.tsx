import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps, useState } from 'react';
import { Pressable } from 'react-native';

import { designTokens } from '@/constants/theme';

import TextField from './TextField';

type PasswordInputProps = ComponentProps<typeof TextField>;

export default function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      secureTextEntry={!showPassword}
      rightAdornment={
        <Pressable onPress={() => setShowPassword((value) => !value)} hitSlop={8}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={designTokens.textSecondary}
          />
        </Pressable>
      }
    />
  );
}
