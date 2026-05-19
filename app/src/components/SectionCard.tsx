import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../theme';

interface SectionCardProps {
  title: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  children: React.ReactNode;
  testID?: string;
}

export function SectionCard({
  title,
  iconName,
  iconColor = colors.primaryContainer,
  children,
  testID,
}: SectionCardProps) {
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={iconColor}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.primaryContainer,
  },
  content: {
    flex: 1,
    padding: spacing.containerPadding,
    gap: spacing.stackGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    ...typography['headline-sm'],
    color: colors.onSurface,
  },
});
