import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../theme';
import { StatusChip, EvaluationStatus } from './StatusChip';
import { ProgressBar } from './ProgressBar';

interface StatusCardProps {
  establecimiento: string;
  status: EvaluationStatus;
  completedItems: number;
  totalItems: number;
  syncDate?: string;
  onPress: () => void;
}

const STATUS_BAR_COLORS: Record<EvaluationStatus, string> = {
  draft: colors.tertiaryContainer,
  in_progress: colors.secondaryContainer,
  complete: colors.secondaryContainer,
  sent: colors.primary,
};

export function StatusCard({
  establecimiento,
  status,
  completedItems,
  totalItems,
  syncDate,
  onPress,
}: StatusCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.statusBar, { backgroundColor: STATUS_BAR_COLORS[status] }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {establecimiento || 'Sin nombre'}
            </Text>
            <Text style={styles.subtitle}>Atencion Primaria</Text>
          </View>
          <StatusChip status={status} />
        </View>
        <ProgressBar completed={completedItems} total={totalItems} />
        {status === 'sent' && syncDate && (
          <View style={styles.syncRow}>
            <MaterialCommunityIcons name="cloud-check" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.syncText}>Sincronizado: {syncDate}</Text>
          </View>
        )}
        {status === 'draft' && (
          <View style={styles.syncRow}>
            <MaterialCommunityIcons name="cloud-off-outline" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.syncText}>Sin sincronizar</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    overflow: 'hidden',
  },
  statusBar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: spacing.containerPadding,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography['headline-sm'],
    color: colors.onSurface,
  },
  subtitle: {
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
});
