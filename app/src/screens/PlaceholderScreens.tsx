import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
}

function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function HomeScreen() {
  return <PlaceholderScreen title="Home" subtitle="Lista de evaluaciones" />;
}

export function IdentificationScreen() {
  return <PlaceholderScreen title="Identificación" subtitle="Datos del establecimiento" />;
}

export function ResultadosScreen() {
  return <PlaceholderScreen title="Resultados" subtitle="Tasas de resultado" />;
}

export function EvaluationScreen() {
  return <PlaceholderScreen title="Evaluación" subtitle="Estructura y Procesos" />;
}

export function ClosureScreen() {
  return <PlaceholderScreen title="Cierre" subtitle="Resumen y envío" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.containerPadding,
  },
  title: {
    ...typography['headline-md'],
    color: colors.onSurface,
    marginBottom: spacing.stackGap,
  },
  subtitle: {
    ...typography['body-md'],
    color: colors.onSurfaceVariant,
  },
});
