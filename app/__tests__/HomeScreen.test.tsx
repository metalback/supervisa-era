import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockGetAllEvaluations = jest.fn().mockResolvedValue(undefined);
const mockCreateEvaluation = jest.fn().mockResolvedValue('new-uuid');

jest.mock('../src/store/evaluation', () => ({
  useEvaluationStore: jest.fn(() => ({
    evaluationsList: [],
    completedItemsCounts: {},
    isLoading: false,
    getAllEvaluations: mockGetAllEvaluations,
    createEvaluation: mockCreateEvaluation,
  })),
}));

import { HomeScreen } from '../src/screens/HomeScreen';

describe('HomeScreen', () => {
  const defaultProps = {
    onNavigateToIdentification: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title', () => {
    const { getByText } = render(<HomeScreen {...defaultProps} />);
    expect(getByText('Supervision de Salud')).toBeTruthy();
  });

  it('renders section header', () => {
    const { getByText } = render(<HomeScreen {...defaultProps} />);
    expect(getByText('Pautas de Evaluacion')).toBeTruthy();
    expect(getByText('Historial reciente de establecimientos')).toBeTruthy();
  });

  it('renders filter button', () => {
    const { getByText } = render(<HomeScreen {...defaultProps} />);
    expect(getByText('Filtrar')).toBeTruthy();
  });

  it('renders empty state when no evaluations', () => {
    const { getByText } = render(<HomeScreen {...defaultProps} />);
    expect(getByText('No hay evaluaciones')).toBeTruthy();
  });

  it('renders FAB button', () => {
    const { getByText } = render(<HomeScreen {...defaultProps} />);
    expect(getByText('+ Nueva Evaluacion')).toBeTruthy();
  });

  it('calls createEvaluation and navigates when FAB pressed', async () => {
    const { getByText } = render(<HomeScreen {...defaultProps} />);
    fireEvent.press(getByText('+ Nueva Evaluacion'));

    await waitFor(() => {
      expect(mockCreateEvaluation).toHaveBeenCalled();
      expect(defaultProps.onNavigateToIdentification).toHaveBeenCalledWith('new-uuid');
    });
  });

  it('loads evaluations on mount', () => {
    render(<HomeScreen {...defaultProps} />);
    expect(mockGetAllEvaluations).toHaveBeenCalled();
  });
});

describe('HomeScreen with evaluations', () => {
  const mockEvaluation = {
    id: 'eval-1',
    establecimiento: 'CESFAM Test',
    status: 'in_progress',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    fecha: null,
    region: null,
    comuna: null,
    codigo_deis: null,
    director: null,
    encargado_era: null,
    poblacion_rem_p3: null,
    horas_administrativas: null,
    email_contacto: null,
    compromisos: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useEvaluationStore } = require('../src/store/evaluation');
    (useEvaluationStore as jest.Mock).mockReturnValue({
      evaluationsList: [mockEvaluation],
      completedItemsCounts: { 'eval-1': 14 },
      isLoading: false,
      getAllEvaluations: jest.fn().mockResolvedValue(undefined),
      createEvaluation: jest.fn().mockResolvedValue('new-uuid'),
    });
  });

  it('renders evaluation cards when list has items', () => {
    const { getByText } = render(
      <HomeScreen onNavigateToIdentification={jest.fn()} />
    );
    expect(getByText('CESFAM Test')).toBeTruthy();
    expect(getByText('En Proceso')).toBeTruthy();
    expect(getByText('14/33 items')).toBeTruthy();
  });
});
