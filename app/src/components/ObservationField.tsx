import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, borderRadius } from '../theme';

interface ObservationFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function ObservationField({ value, onChange }: ObservationFieldProps) {
  const [expanded, setExpanded] = useState(value !== null && value.length > 0);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      onChange(text.length > 0 ? text : null);
    },
    [onChange]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggle}
        onPress={handleToggle}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name={expanded ? 'minus' : 'plus'}
          size={16}
          color={colors.primary}
        />
        <Text style={styles.toggleLabel}>
          {expanded ? 'Ocultar Observación' : 'Agregar Observación'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Observaciones (Opcional)</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Escriba los detalles aquí..."
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            numberOfLines={2}
            value={value ?? ''}
            onChangeText={handleChangeText}
            textAlignVertical="top"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  toggleLabel: {
    ...typography['label-md'],
    color: colors.primary,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    padding: 12,
    backgroundColor: colors.surface,
    ...typography['body-md'],
    color: colors.onSurface,
    minHeight: 56,
  },
});
