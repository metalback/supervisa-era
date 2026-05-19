import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockCheckAuthState = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue('1234'),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/store/auth', () => ({
  useAuthStore: jest.fn(() => ({
    isAuthenticated: true,
    isFirstLaunch: false,
    isLoading: false,
    checkAuthState: mockCheckAuthState,
    setPin: jest.fn(),
    verifyPin: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
  })),
}));

jest.mock('../src/db', () => ({
  createEvaluation: jest.fn().mockResolvedValue('new-uuid'),
  getEvaluation: jest.fn().mockResolvedValue(null),
  getAllEvaluations: jest.fn().mockResolvedValue([]),
  updateEvaluation: jest.fn().mockResolvedValue(undefined),
  deleteEvaluation: jest.fn().mockResolvedValue(undefined),
  getTasas: jest.fn().mockResolvedValue([]),
  upsertTasa: jest.fn().mockResolvedValue(undefined),
  getItems: jest.fn().mockResolvedValue([]),
  updateItemScore: jest.fn().mockResolvedValue(undefined),
  updateItemObservation: jest.fn().mockResolvedValue(undefined),
  addToSyncQueue: jest.fn().mockResolvedValue(undefined),
  getSyncQueue: jest.fn().mockResolvedValue([]),
  removeSyncQueueEntry: jest.fn().mockResolvedValue(undefined),
  incrementSyncAttempts: jest.fn().mockResolvedValue(undefined),
  getCompletedItemsCounts: jest.fn().mockResolvedValue({}),
}));

import { AppNavigator } from '../src/navigation/AppNavigator';
import * as db from '../src/db';

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the real HomeScreen with title after auth', async () => {
    const { getByText } = render(<AppNavigator />);

    await waitFor(() => {
      expect(getByText('Supervision de Salud')).toBeTruthy();
    });
  });

  it('renders the real HomeScreen with section header', async () => {
    const { getByText } = render(<AppNavigator />);

    await waitFor(() => {
      expect(getByText('Pautas de Evaluacion')).toBeTruthy();
      expect(getByText('Historial reciente de establecimientos')).toBeTruthy();
    });
  });

  it('renders the FAB button on HomeScreen', async () => {
    const { getByText } = render(<AppNavigator />);

    await waitFor(() => {
      expect(getByText('+ Nueva Evaluacion')).toBeTruthy();
    });
  });

  it('creates evaluation and navigates to Identification when FAB pressed', async () => {
    const { getByText } = render(<AppNavigator />);

    await waitFor(() => {
      expect(getByText('+ Nueva Evaluacion')).toBeTruthy();
    });

    fireEvent.press(getByText('+ Nueva Evaluacion'));

    await waitFor(() => {
      expect(db.createEvaluation).toHaveBeenCalled();
    });
  });
});
