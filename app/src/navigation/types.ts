import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Pin: { mode: 'create' | 'verify' };
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Identification: undefined;
  Resultados: undefined;
  Evaluation: undefined;
  Closure: undefined;
};

export const RootStack = createNativeStackNavigator<RootStackParamList>();
