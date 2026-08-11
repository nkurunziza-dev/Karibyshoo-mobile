import { type ComponentProps } from 'react';

import TextField from './TextField';

type PhoneInputProps = ComponentProps<typeof TextField>;

export default function PhoneInput(props: PhoneInputProps) {
  return <TextField {...props} keyboardType="phone-pad" autoCapitalize="none" />;
}
