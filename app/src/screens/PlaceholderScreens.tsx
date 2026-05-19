import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Lista de evaluaciones</Text>
    </View>
  );
}

export function IdentificationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identificación</Text>
      <Text style={styles.subtitle}>Datos del establecimiento</Text>
    </View>
  );
}

export function ResultadosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados</Text>
      <Text style={styles.subtitle}>Tasas de resultado</Text>
    </View>
  );
}

export function EvaluationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluación</Text>
      <Text style={styles.subtitle}>Estructura y Procesos</Text>
    </View>
  );
}

export function ClosureScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cierre</Text>
      <Text style={styles.subtitle}>Resumen y envío</Text>
    </View>
  );
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
