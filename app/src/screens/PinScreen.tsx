import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/auth';
import { colors, typography, spacing, borderRadius } from '../theme';

export type PinScreenMode = 'create' | 'verify';

interface PinScreenProps {
  mode: PinScreenMode;
  onSuccess: () => void;
}

export function PinScreen({ mode, onSuccess }: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setPin: savePin, verifyPin } = useAuthStore();

  const handlePinComplete = useCallback(async () => {
    if (mode === 'create') {
      await savePin(pin);
      onSuccess();
    } else {
      const isValid = await verifyPin(pin);
      if (isValid) {
        onSuccess();
      } else {
        setError('PIN incorrecto');
        setTimeout(() => {
          setPin('');
          setError(null);
        }, 1000);
      }
    }
  }, [mode, pin, savePin, verifyPin, onSuccess]);

  useEffect(() => {
    if (pin.length === 4) {
      handlePinComplete();
    }
  }, [pin, handlePinComplete]);

  const handleDigitPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const renderCircles = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <View
        key={i}
        testID="pin-circle"
        style={[
          styles.circle,
          i < pin.length ? styles.circleFilled : styles.circleEmpty,
        ]}
      />
    ));
  };

  const renderKeypad = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    return (
      <View style={styles.keypad}>
        {digits.map((digit) => (
          <Pressable
            key={digit}
            style={styles.key}
            accessibilityLabel={`digit-${digit}`}
            onPress={() => handleDigitPress(digit)}
          >
            <Text style={styles.keyText}>{digit}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.key} accessibilityLabel="delete" onPress={handleDelete}>
          <Text style={styles.keyText}>delete</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'create' ? 'Crear PIN' : 'Ingresa tu PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {mode === 'create' ? 'Ingresa un PIN de 4 dígitos' : 'Ingresa tu PIN de 4 dígitos'}
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.circles}>{renderCircles()}</View>
      {renderKeypad()}
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
    marginBottom: spacing.sectionMargin,
  },
  error: {
    ...typography['body-md'],
    color: colors.error,
    marginBottom: spacing.stackGap,
  },
  circles: {
    flexDirection: 'row',
    gap: spacing.inlineGap,
    marginBottom: spacing.sectionMargin,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  circleFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  circleEmpty: {
    backgroundColor: 'transparent',
    borderColor: colors.outline,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.inlineGap,
    maxWidth: 300,
  },
  key: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    ...typography['headline-md'],
    color: colors.onSurface,
  },
});
