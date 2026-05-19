import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { FormInput } from '../components/FormInput';
import { FormSelect } from '../components/FormSelect';
import { SectionCard } from '../components/SectionCard';
import { BottomNav, NavTab } from '../components/BottomNav';
import { useEvaluationStore } from '../store/evaluation';
import { REGIONES, getComunasByRegion } from '../data/regions';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Identification'>;

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function IdentificationScreen({ route, navigation }: Props) {
  const { evaluationId } = route.params;
  const {
    currentEvaluation,
    isLoading,
    loadEvaluation,
    saveMetadata,
  } = useEvaluationStore();

  const [fecha] = useState(todayISO);
  const [codigoDeis, setCodigoDeis] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [poblacion, setPoblacion] = useState('');
  const [horas, setHoras] = useState('');
  const [director, setDirector] = useState('');
  const [encargado, setEncargado] = useState('');
  const [email, setEmail] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadEvaluation(evaluationId);
  }, [evaluationId, loadEvaluation]);

  useEffect(() => {
    if (currentEvaluation && currentEvaluation.id === evaluationId && !initialized) {
      setCodigoDeis(currentEvaluation.codigo_deis || '');
      setRegion(currentEvaluation.region || '');
      setComuna(currentEvaluation.comuna || '');
      setEstablecimiento(currentEvaluation.establecimiento || '');
      setPoblacion(
        currentEvaluation.poblacion_rem_p3 != null
          ? String(currentEvaluation.poblacion_rem_p3)
          : ''
      );
      setHoras(
        currentEvaluation.horas_administrativas != null
          ? String(currentEvaluation.horas_administrativas)
          : ''
      );
      setDirector(currentEvaluation.director || '');
      setEncargado(currentEvaluation.encargado_era || '');
      setEmail(currentEvaluation.email_contacto || '');
      setInitialized(true);
    }
  }, [currentEvaluation, evaluationId, initialized]);

  const saveField = useCallback(
    (fields: Record<string, unknown>) => {
      saveMetadata(fields as Parameters<typeof saveMetadata>[0]);
    },
    [saveMetadata]
  );

  const handleCodigoDeis = useCallback(
    (text: string) => {
      setCodigoDeis(text);
      saveField({ codigo_deis: text || null });
    },
    [saveField]
  );

  const handleRegion = useCallback(
    (value: string) => {
      setRegion(value);
      setComuna('');
      saveField({ region: value || null, comuna: null });
    },
    [saveField]
  );

  const handleComuna = useCallback(
    (value: string) => {
      setComuna(value);
      saveField({ comuna: value || null });
    },
    [saveField]
  );

  const handleEstablecimiento = useCallback(
    (text: string) => {
      setEstablecimiento(text);
      saveField({ establecimiento: text || null });
    },
    [saveField]
  );

  const handlePoblacion = useCallback(
    (text: string) => {
      setPoblacion(text);
      const num = text ? parseInt(text, 10) : null;
      saveField({ poblacion_rem_p3: isNaN(num as number) ? null : num });
    },
    [saveField]
  );

  const handleHoras = useCallback(
    (text: string) => {
      setHoras(text);
      const num = text ? parseInt(text, 10) : null;
      saveField({ horas_administrativas: isNaN(num as number) ? null : num });
    },
    [saveField]
  );

  const handleDirector = useCallback(
    (text: string) => {
      setDirector(text);
      saveField({ director: text || null });
    },
    [saveField]
  );

  const handleEncargado = useCallback(
    (text: string) => {
      setEncargado(text);
      saveField({ encargado_era: text || null });
    },
    [saveField]
  );

  const handleEmail = useCallback(
    (text: string) => {
      setEmail(text);
      saveField({ email_contacto: text || null });
    },
    [saveField]
  );

  const handleContinue = useCallback(() => {
    if (!establecimiento.trim()) return;
    navigation.navigate('Identification', { evaluationId });
  }, [establecimiento, navigation, evaluationId]);

  const handleTabPress = useCallback(
    (tab: NavTab) => {
      // TODO: navigate to other screens when implemented
    },
    []
  );

  const regionOptions = REGIONES.map((r) => ({ label: r.name, value: r.code }));
  const comunas = region ? getComunasByRegion(region) : [];
  const comunaOptions = comunas.map((c) => ({ label: c, value: c }));

  const isValid = establecimiento.trim().length > 0;

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Supervisión de Salud</Text>
        <TouchableOpacity style={styles.syncButton}>
          <MaterialCommunityIcons
            name="cloud-check-outline"
            size={24}
            color={colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Identificación del Establecimiento</Text>
          <Text style={styles.subtitle}>
            Ingrese los datos base para iniciar la evaluación estructural.
          </Text>
        </View>

        <SectionCard title="Antecedentes Generales" iconName="domain">
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <FormInput
                label="Fecha de Registro"
                value={fecha}
                onChangeText={() => {}}
                editable={false}
                testID="input-fecha"
              />
            </View>
            <View style={styles.fieldHalf}>
              <FormInput
                label="Código DEIS"
                value={codigoDeis}
                onChangeText={handleCodigoDeis}
                placeholder="Ej. 112233"
                testID="input-codigo-deis"
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <FormSelect
                label="Región"
                value={region}
                onValueChange={handleRegion}
                options={regionOptions}
                placeholder="Seleccione Región..."
                testID="select-region"
              />
            </View>
            <View style={styles.fieldHalf}>
              <FormSelect
                label="Comuna"
                value={comuna}
                onValueChange={handleComuna}
                options={comunaOptions}
                placeholder="Seleccione Comuna..."
                testID="select-comuna"
              />
            </View>
          </View>
          <FormInput
            label="Nombre del Establecimiento"
            value={establecimiento}
            onChangeText={handleEstablecimiento}
            placeholder="Nombre oficial del CESFAM, CECOSF, etc."
            testID="input-establecimiento"
          />
        </SectionCard>

        <SectionCard
          title="Datos REM"
          iconName="chart-bar"
          iconColor={colors.secondary}
        >
          <FormInput
            label="Población bajo control ERA"
            value={poblacion}
            onChangeText={handlePoblacion}
            placeholder="0"
            keyboardType="numeric"
            testID="input-poblacion"
          />
          <FormInput
            label="Horas Administrativas Mensuales"
            value={horas}
            onChangeText={handleHoras}
            placeholder="0"
            keyboardType="numeric"
            suffix="hrs"
            testID="input-horas"
          />
        </SectionCard>

        <SectionCard title="Datos de Gestión" iconName="account-tie">
          <FormInput
            label="Nombre Director(a)"
            value={director}
            onChangeText={handleDirector}
            placeholder="Nombre completo"
            testID="input-director"
          />
          <FormInput
            label="Nombre Encargado(a) Sala ERA"
            value={encargado}
            onChangeText={handleEncargado}
            placeholder="Nombre completo"
            testID="input-encargado"
          />
        </SectionCard>

        <SectionCard
          title="Información de Contacto"
          iconName="email-outline"
          iconColor={colors.secondary}
        >
          <FormInput
            label="Email Institucional de Contacto"
            value={email}
            onChangeText={handleEmail}
            placeholder="correo@institucion.cl"
            keyboardType="email-address"
            helperText="Este correo recibirá la copia del informe final."
            testID="input-email"
          />
        </SectionCard>

        <View style={styles.actionArea}>
          <TouchableOpacity
            style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isValid}
            testID="button-continue"
          >
            <Text style={styles.continueButtonText}>Continuar a Indicadores</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={colors.onPrimary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav
        activeTab="identificacion"
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
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.stackGap,
  },
  fieldHalf: {
    flex: 1,
  },
  actionArea: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing.sectionMargin,
    alignItems: 'flex-end',
  },
  continueButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    width: '100%',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    ...typography['body-lg'],
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
