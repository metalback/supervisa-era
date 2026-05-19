import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import { BinarySelector } from './BinarySelector';
import { ObservationField } from './ObservationField';

interface EvaluationItemProps {
  itemNumero: number;
  label: string;
  puntaje: 0 | 1 | null;
  observacion: string | null;
  onScoreChange: (puntaje: 0 | 1 | null) => void;
  onObservationChange: (observacion: string | null) => void;
}

export function EvaluationItem({
  itemNumero,
  label,
  puntaje,
  observacion,
  onScoreChange,
  onObservationChange,
}: EvaluationItemProps) {
  const displayNumber = itemNumero <= 12
    ? `1.${itemNumero}`
    : `2.${itemNumero - 12}`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.number}>{displayNumber}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <BinarySelector value={puntaje} onChange={onScoreChange} />
      <ObservationField value={observacion} onChange={onObservationChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.xl,
    padding: spacing.containerPadding,
    gap: spacing.stackGap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  number: {
    ...typography['headline-sm'],
    color: colors.primary,
  },
  label: {
    ...typography['body-md'],
    color: colors.onSurface,
    flex: 1,
  },
});
