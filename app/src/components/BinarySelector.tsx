import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../theme';

interface BinarySelectorProps {
  value: 0 | 1 | null;
  onChange: (value: 0 | 1 | null) => void;
}

export function BinarySelector({ value, onChange }: BinarySelectorProps) {
  const handleYes = () => {
    onChange(value === 1 ? null : 1);
  };

  const handleNo = () => {
    onChange(value === 0 ? null : 0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.leftButton,
          value === 1 && styles.activeButtonShadow,
          value === 1 && styles.activeYesButton,
        ]}
        onPress={handleYes}
        accessibilityRole="button"
        accessibilityState={{ selected: value === 1 }}
      >
        <Text style={[styles.label, value === 1 && styles.activeYesLabel]}>
          Sí (1)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          styles.rightButton,
          value === 0 && styles.activeButtonShadow,
          value === 0 && styles.activeNoButton,
        ]}
        onPress={handleNo}
        accessibilityRole="button"
        accessibilityState={{ selected: value === 0 }}
      >
        <Text style={[styles.label, value === 0 && styles.activeNoLabel]}>
          No (0)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    borderTopLeftRadius: borderRadius.default,
    borderBottomLeftRadius: borderRadius.default,
  },
  rightButton: {
    borderTopRightRadius: borderRadius.default,
    borderBottomRightRadius: borderRadius.default,
  },
  activeButtonShadow: {
    borderRadius: borderRadius.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activeYesButton: {
    backgroundColor: colors.primary,
  },
  activeNoButton: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  label: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  activeYesLabel: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  activeNoLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});
