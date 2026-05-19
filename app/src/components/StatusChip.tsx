import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../theme';

export type EvaluationStatus = 'draft' | 'in_progress' | 'complete' | 'sent';

interface StatusChipProps {
  status: EvaluationStatus;
}

const STATUS_CONFIG: Record<EvaluationStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Pendiente', bg: colors.tertiaryContainer, text: colors.onTertiaryContainer },
  in_progress: { label: 'En Proceso', bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
  complete: { label: 'Completa', bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
  sent: { label: 'Enviada', bg: colors.primary, text: colors.onPrimary },
};

export function StatusChip({ status }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.chip, { backgroundColor: config.bg }]}>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography['label-md'],
  },
});
