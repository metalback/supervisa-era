import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { StatusCard } from '../components/StatusCard';
import { FAB } from '../components/FAB';
import { useEvaluationStore } from '../store/evaluation';
import type { Evaluation } from '../db';

const TOTAL_ITEMS = 33;

interface HomeScreenProps {
  onNavigateToIdentification: (evaluationId: string) => void;
}

export function HomeScreen({ onNavigateToIdentification }: HomeScreenProps) {
  const {
    evaluationsList,
    completedItemsCounts,
    isLoading,
    getAllEvaluations,
    createEvaluation,
  } = useEvaluationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllEvaluations();
  }, [getAllEvaluations]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllEvaluations();
    setRefreshing(false);
  }, [getAllEvaluations]);

  const handleNewEvaluation = useCallback(async () => {
    const id = await createEvaluation();
    onNavigateToIdentification(id);
  }, [createEvaluation, onNavigateToIdentification]);

  const renderItem = useCallback(
    ({ item }: { item: Evaluation }) => (
      <StatusCard
        establecimiento={item.establecimiento || ''}
        status={item.status}
        completedItems={completedItemsCounts[item.id] || 0}
        totalItems={TOTAL_ITEMS}
        syncDate={item.status === 'sent' ? new Date(item.updated_at).toLocaleDateString() : undefined}
        onPress={() => onNavigateToIdentification(item.id)}
      />
    ),
    [onNavigateToIdentification, completedItemsCounts]
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={colors.onSurfaceVariant} />
        <Text style={styles.emptyTitle}>No hay evaluaciones</Text>
        <Text style={styles.emptySubtitle}>
          Crea una nueva evaluacion con el boton + para comenzar
        </Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Supervision de Salud</Text>
        <TouchableOpacity style={styles.syncButton}>
          <MaterialCommunityIcons name="cloud-check-outline" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pautas de Evaluacion</Text>
        <Text style={styles.sectionSubtitle}>Historial reciente de establecimientos</Text>
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <MaterialCommunityIcons name="filter-variant" size={18} color={colors.onSurfaceVariant} />
        <Text style={styles.filterLabel}>Filtrar</Text>
      </TouchableOpacity>
      <FlatList
        data={evaluationsList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={evaluationsList.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <FAB label="+ Nueva Evaluacion" onPress={handleNewEvaluation} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surfaceContainerLowest,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  menuButton: {
    padding: 4,
  },
  topBarTitle: {
    ...typography['headline-md-mobile'],
    color: colors.onSurface,
  },
  syncButton: {
    padding: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 4,
  },
  sectionTitle: {
    ...typography['headline-sm'],
    color: colors.onSurface,
  },
  sectionSubtitle: {
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  filterLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.containerPadding,
    gap: 12,
  },
  emptyTitle: {
    ...typography['headline-md'],
    color: colors.onSurface,
  },
  emptySubtitle: {
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
