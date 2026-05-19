import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { ProgressHeader } from '../components/ProgressHeader';
import { EvaluationItem } from '../components/EvaluationItem';
import { useEvaluationStore } from '../store/evaluation';
import { ITEM_LABELS, ESTRUCTURA_COUNT, PROCESOS_COUNT, TOTAL_ITEMS } from '../data/evaluationItems';
import type { EvaluacionItem } from '../db';

type TabKey = 'estructura' | 'procesos';

interface EvaluationScreenProps {
  evaluationId: string;
  onNavigateToClosure: (evaluationId: string) => void;
}

export function EvaluationScreen({
  evaluationId,
  onNavigateToClosure,
}: EvaluationScreenProps) {
  const {
    currentEvaluation,
    items,
    isLoading,
    loadEvaluation,
    saveItemScore,
    saveItemObservation,
  } = useEvaluationStore();
  const [activeTab, setActiveTab] = useState<TabKey>('estructura');
  const [lastSaveTime, setLastSaveTime] = useState<Date>(new Date());

  useEffect(() => {
    loadEvaluation(evaluationId);
  }, [evaluationId, loadEvaluation]);

  const completedCount = useMemo(
    () => items.filter((item) => item.puntaje !== null).length,
    [items]
  );

  const estructuraItems = useMemo(
    () => items.filter((item) => item.categoria === 'estructura'),
    [items]
  );

  const procesosItems = useMemo(
    () => items.filter((item) => item.categoria === 'procesos'),
    [items]
  );

  const activeItems = activeTab === 'estructura' ? estructuraItems : procesosItems;

  const handleScoreChange = useCallback(
    async (itemNumero: number, puntaje: 0 | 1 | null) => {
      await saveItemScore(itemNumero, puntaje);
      setLastSaveTime(new Date());
    },
    [saveItemScore]
  );

  const handleObservationChange = useCallback(
    async (itemNumero: number, observacion: string | null) => {
      await saveItemObservation(itemNumero, observacion);
      setLastSaveTime(new Date());
    },
    [saveItemObservation]
  );

  const handleFinalizar = useCallback(() => {
    onNavigateToClosure(evaluationId);
  }, [evaluationId, onNavigateToClosure]);

  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Guardado automáticamente hace menos de 1 min.';
    return `Guardado automáticamente hace ${diffMin} min.`;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: EvaluacionItem }) => (
      <EvaluationItem
        itemNumero={item.item_numero}
        label={ITEM_LABELS[item.item_numero] || ''}
        puntaje={item.puntaje as 0 | 1 | null}
        observacion={item.observacion}
        onScoreChange={(puntaje) => handleScoreChange(item.item_numero, puntaje)}
        onObservationChange={(obs) => handleObservationChange(item.item_numero, obs)}
      />
    ),
    [handleScoreChange, handleObservationChange]
  );

  const renderFooter = useCallback(
    () => (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.finalizarButton}
          onPress={handleFinalizar}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.onPrimary} />
          <Text style={styles.finalizarText}>Finalizar Evaluación</Text>
        </TouchableOpacity>
        <Text style={styles.saveTimestamp}>{formatTimeAgo(lastSaveTime)}</Text>
      </View>
    ),
    [handleFinalizar, lastSaveTime, formatTimeAgo]
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Evaluación</Text>
      </View>
      <ProgressHeader completed={completedCount} total={TOTAL_ITEMS} />
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'estructura' && styles.activeTab]}
          onPress={() => setActiveTab('estructura')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'estructura' }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'estructura' && styles.activeTabText,
            ]}
          >
            Estructura
          </Text>
          <View
            style={[
              styles.badge,
              activeTab === 'estructura' ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                activeTab === 'estructura' && styles.activeBadgeText,
              ]}
            >
              {ESTRUCTURA_COUNT}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'procesos' && styles.activeTab]}
          onPress={() => setActiveTab('procesos')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'procesos' }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'procesos' && styles.activeTabText,
            ]}
          >
            Procesos
          </Text>
          <View
            style={[
              styles.badge,
              activeTab === 'procesos' ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                activeTab === 'procesos' && styles.activeBadgeText,
              ]}
            >
              {PROCESOS_COUNT}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListFooterComponent={renderFooter}
        initialNumToRender={12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surfaceContainerLowest,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  topBarTitle: {
    ...typography['headline-md-mobile'],
    color: colors.onSurface,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 28,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: colors.primaryContainer,
  },
  inactiveBadge: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  badgeText: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  activeBadgeText: {
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
  list: {
    padding: spacing.containerPadding,
    gap: spacing.stackGap,
    paddingBottom: 100,
  },
  footer: {
    paddingTop: 16,
    gap: 8,
    alignItems: 'center',
  },
  finalizarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  finalizarText: {
    ...typography['headline-sm'],
    color: colors.onPrimary,
  },
  saveTimestamp: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
});
