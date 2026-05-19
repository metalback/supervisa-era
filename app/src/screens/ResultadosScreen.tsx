import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useEvaluationStore } from '../store/evaluation';

type TasaTipo = 'asma' | 'epoc' | 'cobertura_vnc';

interface TasaBlock {
  tipo: TasaTipo;
  title: string;
  icon: string;
}

const TASA_BLOCKS: TasaBlock[] = [
  { tipo: 'asma', title: 'Asma', icon: 'lungs' },
  { tipo: 'epoc', title: 'EPOC', icon: 'weather-windy' },
  { tipo: 'cobertura_vnc', title: 'Coberturas', icon: 'shield-check' },
];

interface ResultadosScreenProps {
  evaluationId: string;
  onNavigateToEvaluation: (evaluationId: string) => void;
}

export function ResultadosScreen({
  evaluationId,
  onNavigateToEvaluation,
}: ResultadosScreenProps) {
  const { tasas, saveTasas, loadEvaluation } = useEvaluationStore();

  const [values, setValues] = useState<
    Record<TasaTipo, { numerador: string; denominador: string }>
  >({
    asma: { numerador: '', denominador: '' },
    epoc: { numerador: '', denominador: '' },
    cobertura_vnc: { numerador: '', denominador: '' },
  });

  const prevTasasRef = useRef<string>('');

  useEffect(() => {
    loadEvaluation(evaluationId);
  }, [evaluationId, loadEvaluation]);

  useEffect(() => {
    const tasasKey = JSON.stringify(tasas);
    if (tasasKey === prevTasasRef.current) return;
    prevTasasRef.current = tasasKey;

    setValues((prev) => {
      const next = { ...prev };
      for (const tasa of tasas) {
        next[tasa.tipo] = {
          numerador: tasa.numerador != null ? String(tasa.numerador) : '',
          denominador: tasa.denominador != null ? String(tasa.denominador) : '',
        };
      }
      return next;
    });
  }, [tasas]);

  const handleChange = useCallback(
    (tipo: TasaTipo, field: 'numerador' | 'denominador', text: string) => {
      setValues((prev) => {
        const updated = {
          ...prev,
          [tipo]: { ...prev[tipo], [field]: text },
        };

        const num = text === '' ? null : parseInt(text, 10);
        if (text !== '' && isNaN(num as number)) return prev;

        const numerador =
          field === 'numerador'
            ? num
            : updated[tipo].numerador === ''
            ? null
            : parseInt(updated[tipo].numerador, 10);
        const denominador =
          field === 'denominador'
            ? num
            : updated[tipo].denominador === ''
            ? null
            : parseInt(updated[tipo].denominador, 10);

        saveTasas(tipo, numerador, denominador);
        return updated;
      });
    },
    [saveTasas]
  );

  const handleContinue = useCallback(() => {
    onNavigateToEvaluation(evaluationId);
  }, [evaluationId, onNavigateToEvaluation]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Supervisión de Salud</Text>
        <TouchableOpacity style={styles.syncButton}>
          <MaterialCommunityIcons name="cloud-check-outline" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Indicadores de Resultado</Text>
          <Text style={styles.subtitle}>
            Pre-carga de datos estadísticos del establecimiento.
          </Text>
          <View style={styles.infoBanner}>
            <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              La tasa será calculada automáticamente en la planilla Excel final.
            </Text>
          </View>
        </View>

        {TASA_BLOCKS.map((block) => (
          <View key={block.tipo} style={styles.tasaCard}>
            <View style={styles.tasaHeader}>
              <MaterialCommunityIcons
                name={block.icon as any}
                size={20}
                color={colors.secondary}
              />
              <Text style={styles.tasaTitle}>{block.title}</Text>
            </View>
            <View style={styles.tasaFields}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Numerador</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="0"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="numeric"
                  value={values[block.tipo]?.numerador ?? ''}
                  onChangeText={(text) => handleChange(block.tipo, 'numerador', text)}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Denominador</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="0"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="numeric"
                  value={values[block.tipo]?.denominador ?? ''}
                  onChangeText={(text) => handleChange(block.tipo, 'denominador', text)}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continuar a Evaluación en Terreno</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="file-tree" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>Estructura</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="heart-cog" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>Procesos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <MaterialCommunityIcons name="chart-box" size={24} color={colors.onPrimaryContainer} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Resultados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="headset" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>Soporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>Cierre</Text>
        </TouchableOpacity>
      </View>
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
    color: colors.primary,
  },
  syncButton: {
    padding: 4,
  },
  content: {
    padding: spacing.containerPadding,
    paddingBottom: 100,
    gap: spacing.sectionMargin,
  },
  headerSection: {
    gap: spacing.base,
  },
  title: {
    ...typography['headline-md'],
    color: colors.onSurface,
  },
  subtitle: {
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.containerPadding,
    marginTop: spacing.base,
  },
  infoText: {
    ...typography['body-md'],
    color: colors.onSurface,
    flex: 1,
  },
  tasaCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.xl,
    padding: spacing.containerPadding,
    gap: spacing.stackGap,
  },
  tasaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingBottom: 8,
  },
  tasaTitle: {
    ...typography['headline-sm'],
    color: colors.onSurface,
  },
  tasaFields: {
    gap: spacing.stackGap,
    marginTop: spacing.base,
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.default,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typography['body-lg'],
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainerLowest,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-end',
    marginTop: spacing.base,
  },
  continueText: {
    ...typography['headline-sm'],
    color: colors.onPrimary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  navItemActive: {
    backgroundColor: colors.primaryContainer,
  },
  navLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  navLabelActive: {
    color: colors.onPrimaryContainer,
  },
});
