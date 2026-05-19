import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, borderRadius } from '../theme';

interface FormSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  testID?: string;
}

export function FormSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Seleccione...',
  testID,
}: FormSelectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
        testID={testID}
      >
        <Text
          style={[styles.triggerText, !selectedLabel && styles.placeholder]}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    ...typography['label-md'],
    color: colors.onSurfaceVariant,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerText: {
    ...typography['body-md'],
    color: colors.onSurface,
    flex: 1,
  },
  placeholder: {
    color: colors.outline,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalTitle: {
    ...typography['headline-sm'],
    color: colors.onSurface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainer,
  },
  optionSelected: {
    backgroundColor: colors.surfaceContainerLow,
  },
  optionText: {
    ...typography['body-md'],
    color: colors.onSurface,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
