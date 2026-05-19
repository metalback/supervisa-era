import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type KeyboardTypeOptions,
} from 'react-native';
import { colors, typography, borderRadius } from '../theme';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  helperText?: string;
  suffix?: string;
  testID?: string;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  keyboardType,
  helperText,
  suffix,
  testID,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            !editable && styles.inputDisabled,
            isFocused && styles.inputFocused,
            suffix && styles.inputWithSuffix,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          editable={editable}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typography['body-md'],
    color: colors.onSurface,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceContainerLow,
    color: colors.onSurfaceVariant,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputWithSuffix: {
    paddingRight: 36,
  },
  suffix: {
    position: 'absolute',
    right: 12,
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
  },
  helperText: {
    ...typography['label-md'],
    color: colors.outline,
    marginTop: 2,
  },
});
