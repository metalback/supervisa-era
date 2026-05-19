export type RootStackParamList = {
  Pin: { mode: 'create' | 'verify' };
  Home: undefined;
  Identification: { evaluationId: string };
  Evaluation: { evaluationId: string };
  Closure: { evaluationId: string };
};
