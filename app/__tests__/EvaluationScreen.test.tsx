import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockSaveItemScore = jest.fn().mockResolvedValue(undefined);
const mockSaveItemObservation = jest.fn().mockResolvedValue(undefined);
const mockLoadEvaluation = jest.fn().mockResolvedValue(undefined);
const mockSetStatus = jest.fn().mockResolvedValue(undefined);

const mockItems = Array.from({ length: 33 }, (_, i) => ({
  id: i + 1,
  evaluation_id: 'eval-1',
  item_numero: i + 1,
  categoria: i < 12 ? 'estructura' : 'procesos',
  puntaje: null,
  observacion: null,
}));

jest.mock('../src/store/evaluation', () => ({
  useEvaluationStore: jest.fn(() => ({
    currentEvaluation: {
      id: 'eval-1',
      establecimiento: 'CESFAM Test',
      status: 'in_progress',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    items: mockItems,
    isLoading: false,
    loadEvaluation: mockLoadEvaluation,
    saveItemScore: mockSaveItemScore,
    saveItemObservation: mockSaveItemObservation,
    setStatus: mockSetStatus,
  })),
}));

import { EvaluationScreen } from '../src/screens/EvaluationScreen';

describe('EvaluationScreen', () => {
  const defaultProps = {
    evaluationId: 'eval-1',
    onNavigateToClosure: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders progress header with completion count', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('Avance General')).toBeTruthy();
    expect(getByText('0/33 Completados')).toBeTruthy();
  });

  it('renders Estructura and Procesos tabs', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('Estructura')).toBeTruthy();
    expect(getByText('Procesos')).toBeTruthy();
  });

  it('renders Estructura tab badge with 12 count', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('12')).toBeTruthy();
  });

  it('renders Procesos tab badge with 21 count', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('21')).toBeTruthy();
  });

  it('shows Estructura items by default (items 1-12)', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('1.1')).toBeTruthy();
    expect(getByText('1.12')).toBeTruthy();
  });

  it('switches to Procesos tab when pressed', () => {
    const { getByText, queryByText } = render(<EvaluationScreen {...defaultProps} />);
    fireEvent.press(getByText('Procesos'));
    expect(getByText('2.1')).toBeTruthy();
    expect(getByText('2.9')).toBeTruthy();
    expect(queryByText('1.1')).toBeNull();
  });

  it('shows item labels', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText(/Horas profesionales/)).toBeTruthy();
  });

  it('calls saveItemScore when BinarySelector changes', async () => {
    const { getAllByText } = render(<EvaluationScreen {...defaultProps} />);
    const siButtons = getAllByText('Sí (1)');
    fireEvent.press(siButtons[0]);
    await waitFor(() => {
      expect(mockSaveItemScore).toHaveBeenCalledWith(1, 1);
    });
  });

  it('calls saveItemObservation when observation text changes', async () => {
    const { getByText, getAllByText, getAllByPlaceholderText } = render(
      <EvaluationScreen {...defaultProps} />
    );
    const addButtons = getAllByText('Agregar Observación');
    fireEvent.press(addButtons[0]);
    const textareas = getAllByPlaceholderText('Escriba los detalles aquí...');
    fireEvent.changeText(textareas[0], 'Test observation');
    await waitFor(() => {
      expect(mockSaveItemObservation).toHaveBeenCalledWith(1, 'Test observation');
    });
  });

  it('renders Finalizar Evaluación button', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('Finalizar Evaluación')).toBeTruthy();
  });

  it('navigates to closure when Finalizar is pressed', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    fireEvent.press(getByText('Finalizar Evaluación'));
    expect(defaultProps.onNavigateToClosure).toHaveBeenCalledWith('eval-1');
  });

  it('loads evaluation on mount', () => {
    render(<EvaluationScreen {...defaultProps} />);
    expect(mockLoadEvaluation).toHaveBeenCalledWith('eval-1');
  });

  it('shows completed count when items have scores', () => {
    const { useEvaluationStore } = require('../src/store/evaluation');
    const itemsWithScores = mockItems.map((item, i) => ({
      ...item,
      puntaje: i < 5 ? 1 : null,
    }));
    (useEvaluationStore as jest.Mock).mockReturnValue({
      currentEvaluation: { id: 'eval-1', status: 'in_progress' },
      items: itemsWithScores,
      isLoading: false,
      loadEvaluation: mockLoadEvaluation,
      saveItemScore: mockSaveItemScore,
      saveItemObservation: mockSaveItemObservation,
      setStatus: mockSetStatus,
    });

    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText('5/33 Completados')).toBeTruthy();
  });

  it('shows autosave timestamp', () => {
    const { getByText } = render(<EvaluationScreen {...defaultProps} />);
    expect(getByText(/Guardado automáticamente/)).toBeTruthy();
  });
});
