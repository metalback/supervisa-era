import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { SectionCard } from '../components/SectionCard';
import { ProgressBar } from '../components/ProgressBar';
import { StatusChip } from '../components/StatusChip';
import { BottomNav, NavTab } from '../components/BottomNav';
import { useEvaluationStore } from '../store/evaluation';
import { checkConnectivity, queueForSync, generateExcel, buildPayload } from '../services';
import { TOTAL_ITEMS } from '../data/evaluationItems';
import { cacheDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Closure'>;

export function ClosureScreen({ route }: Props) {
  const { evaluationId } = route.params;
  const {
    currentEvaluation,
    items,
    tasas,
    isLoading,
    loadEvaluation,
    saveCompromisos,
    saveEmailDestinatario,
    setStatus,
  } = useEvaluationStore();

  const [compromisos, setCompromisos] = useState('');
  const [emailDestinatario, setEmailDestinatario] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadEvaluation(evaluationId);
    checkConnectivity().then(setIsOnline);
  }, [evaluationId, loadEvaluation]);

  useEffect(() => {
    if (currentEvaluation && currentEvaluation.id === evaluationId && !initialized) {
      setCompromisos(currentEvaluation.compromisos || '');
      setEmailDestinatario(currentEvaluation.email_destinatario || '');
      setInitialized(true);
    }
  }, [currentEvaluation, evaluationId, initialized]);

  const completedCount = useMemo(
    () => items.filter((item) => item.puntaje !== null).length,
    [items]
  );

  const observationsCount = useMemo(
    () => items.filter((item) => item.observacion && item.observacion.trim().length > 0).length,
    [items]
  );

  const handleCompromisosChange = useCallback(
    (text: string) => {
      setCompromisos(text);
      saveCompromisos(text);
    },
    [saveCompromisos]
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmailDestinatario(text);
      saveEmailDestinatario(text);
    },
    [saveEmailDestinatario]
  );

  const handleGenerarExcel = useCallback(async () => {
    if (!currentEvaluation) return;

    setIsGenerating(true);
    try {
      const payload = buildPayload(currentEvaluation, tasas, items);
      const online = await checkConnectivity();

      if (online) {
        const blob = await generateExcel(payload);
        const fileName = `PAUTA_ERA_${currentEvaluation.establecimiento || 'eval'}_${currentEvaluation.fecha || 'sin_fecha'}.xlsx`;
        const fileUri = `${cacheDirectory}${fileName}`;

        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const base64Data = base64.split(',')[1];
        await writeAsStringAsync(fileUri, base64Data, {
          encoding: EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Compartir Planilla ERA',
        });

        await setStatus('sent');
      } else {
        await queueForSync(evaluationId, payload);
        Alert.alert(
          'Sin conexión',
          'La evaluación se ha guardado en la cola de sincronización. Se enviará automáticamente cuando haya conectividad.',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', message, [{ text: 'OK' }]);
    } finally {
      setIsGenerating(false);
    }
  }, [currentEvaluation, tasas, items, evaluationId, setStatus]);

  const handleTabPress = useCallback(
    (tab: NavTab) => {},
    []
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Cierre</Text>
        <TouchableOpacity style={styles.syncButton}>
          <MaterialCommunityIcons
            name={isOnline ? 'cloud-check-outline' : 'cloud-off-outline'}
            size={24}
            color={isOnline ? colors.onSurfaceVariant : colors.error}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cierre de Evaluación</Text>
          <Text style={styles.subtitle}>
            Revise el resumen y genere la planilla oficial.
          </Text>
        </View>

        <View style={[styles.statusBanner, isOnline ? styles.bannerOnline : styles.bannerOffline]}>
          <MaterialCommunityIcons
            name={isOnline ? 'wifi' : 'cloud-off-outline'}
            size={20}
            color={isOnline ? '#166534' : '#92400e'}
          />
          <Text style={[styles.bannerText, isOnline ? styles.bannerTextOnline : styles.bannerTextOffline]}>
            {isOnline ? 'Sistema en línea - Sincronizado' : 'Sin conexión - Pendiente de envío'}
          </Text>
        </View>

        <SectionCard title="Resumen de Evaluación" iconName="clipboard-text-outline">
          <View style={styles.resumenHeader}>
            <View style={styles.resumenTitleRow}>
              <Text style={styles.establecimientoName} numberOfLines={2}>
                {currentEvaluation?.establecimiento || 'Sin nombre'}
              </Text>
              <StatusChip status="complete" />
            </View>
            {currentEvaluation?.codigo_deis ? (
              <Text style={styles.codigoDeis}>Código DEIS: {currentEvaluation.codigo_deis}</Text>
            ) : null}
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progreso Global</Text>
            <ProgressBar completed={completedCount} total={TOTAL_ITEMS} />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.statValue}>{completedCount}/{TOTAL_ITEMS}</Text>
              <Text style={styles.statLabel}>Items Revisados</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="text-box-outline" size={20} color={colors.secondary} />
              <Text style={styles.statValue}>{observationsCount}</Text>
              <Text style={styles.statLabel}>Observaciones</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard title="Finalización de Visita" iconName="file-sign" iconColor={colors.secondary}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Compromisos y Plan de Trabajo</Text>
            <TextInput
              style={styles.textarea}
              value={compromisos}
              onChangeText={handleCompromisosChange}
              placeholder="Describa los acuerdos alcanzados, compromisos pendientes y plan de trabajo con el establecimiento..."
              placeholderTextColor={colors.outline}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              testID="input-compromisos"
            />
            <Text style={styles.helperText}>Este texto se incluirá en el reporte final.</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email del Destinatario (Opcional)</Text>
            <View style={styles.emailInputWrapper}>
              <MaterialCommunityIcons name="email-outline" size={20} color={colors.onSurfaceVariant} style={styles.emailIcon} />
              <TextInput
                style={styles.emailInput}
                value={emailDestinatario}
                onChangeText={handleEmailChange}
                placeholder="correo@ejemplo.cl"
                placeholderTextColor={colors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="input-email-destinatario"
              />
            </View>
            <Text style={styles.helperText}>Se enviará una copia del reporte a este correo.</Text>
          </View>
        </SectionCard>

        <View style={styles.actionArea}>
          <TouchableOpacity
            style={[styles.generarButton, isGenerating && styles.generarButtonDisabled]}
            onPress={handleGenerarExcel}
            disabled={isGenerating}
            activeOpacity={0.8}
            testID="button-generar-excel"
          >
            <MaterialCommunityIcons
              name="file-excel"
              size={22}
              color={colors.onPrimary}
            />
            <Text style={styles.generarButtonText}>
              {isGenerating ? 'Generando...' : 'Generar y Enviar Planilla Excel'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav
        activeTab="cierre"
        onTabPress={handleTabPress}
        testID="bottom-nav"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  menuButton: {
    padding: 4,
  },
  topBarTitle: {
    ...typography['headline-md-mobile'],
    color: colors.primary,
  },
  syncButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.containerPadding,
    paddingBottom: 32,
    gap: spacing.sectionMargin,
  },
  header: {
    gap: 4,
  },
  title: {
    ...typography['display-lg'],
    color: colors.onSurface,
    fontSize: 28,
  },
  subtitle: {
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.lg,
  },
  bannerOnline: {
    backgroundColor: '#dcfce7',
  },
  bannerOffline: {
    backgroundColor: '#fef3c7',
  },
  bannerText: {
    ...typography['body-md'],
    fontWeight: '500',
  },
  bannerTextOnline: {
    color: '#166534',
  },
  bannerTextOffline: {
    color: '#92400e',
  },
  resumenHeader: {
    gap: 4,
  },
  resumenTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  establecimientoName: {
    ...typography['headline-sm'],
    color: colors.onSurface,
    flex: 1,
  },
  codigoDeis: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  progressSection: {
    gap: 6,
  },
  progressLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.stackGap,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
  },
  statValue: {
    ...typography['headline-sm'],
    color: colors.onSurface,
  },
  statLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  textarea: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typography['body-md'],
    color: colors.onSurface,
    minHeight: 120,
  },
  helperText: {
    ...typography['label-md'],
    color: colors.outline,
    marginTop: 2,
  },
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
  },
  emailIcon: {
    marginRight: 8,
  },
  emailInput: {
    flex: 1,
    paddingVertical: 10,
    ...typography['body-md'],
    color: colors.onSurface,
  },
  actionArea: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing.sectionMargin,
  },
  generarButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    width: '100%',
  },
  generarButtonDisabled: {
    opacity: 0.6,
  },
  generarButtonText: {
    ...typography['body-lg'],
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
