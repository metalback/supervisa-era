import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

export type NavTab = 'identificacion' | 'resultados' | 'estructura' | 'procesos' | 'cierre';

interface BottomNavProps {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
  testID?: string;
}

const TABS: { key: NavTab; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'identificacion', label: 'Identificación', icon: 'domain' },
  { key: 'resultados', label: 'Resultados', icon: 'chart-bar' },
  { key: 'estructura', label: 'Estructura', icon: 'file-tree-outline' },
  { key: 'procesos', label: 'Procesos', icon: 'cog-outline' },
  { key: 'cierre', label: 'Cierre', icon: 'check-circle-outline' },
];

export function BottomNav({ activeTab, onTabPress, testID }: BottomNavProps) {
  return (
    <View style={styles.container} testID={testID}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
            testID={`nav-tab-${tab.key}`}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={22}
              color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant}
            />
            <Text
              style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    height: 64,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  tabActive: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  tabLabel: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
    fontSize: 10,
  },
  tabLabelActive: {
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
});
