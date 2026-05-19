import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ProgressHeaderProps {
  completed: number;
  total: number;
}

export function ProgressHeader({ completed, total }: ProgressHeaderProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Avance General</Text>
        <Text style={styles.count}>{completed}/{total} Completados</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: 12,
    gap: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  count: {
    ...typography['label-md'],
    color: colors.primary,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 9999,
  },
});
