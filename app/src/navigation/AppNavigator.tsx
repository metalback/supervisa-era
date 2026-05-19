import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/auth';
import { PinScreen } from '../screens/PinScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { IdentificationScreen } from '../screens/IdentificationScreen';
import { ResultadosScreen } from '../screens/ResultadosScreen';
import { EvaluationScreen } from '../screens/PlaceholderScreens';
import { RootStackParamList } from './types';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isAuthenticated, isFirstLaunch, isLoading, checkAuthState } = useAuthStore();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Pin">
            {() => (
              <PinScreen
                mode={isFirstLaunch ? 'create' : 'verify'}
                onSuccess={() => {}}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {({ navigation }) => (
                <HomeScreen
                  onNavigateToIdentification={(evaluationId: string) =>
                    navigation.navigate('Identification', { evaluationId })
                  }
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Identification" component={IdentificationScreen} />
            <Stack.Screen name="Resultados">
              {({ route, navigation }) => (
                <ResultadosScreen
                  evaluationId={route.params.evaluationId}
                  onNavigateToEvaluation={(evaluationId: string) =>
                    navigation.navigate('Evaluation', { evaluationId })
                  }
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Evaluation" component={EvaluationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
