import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockSaveTasas = jest.fn().mockResolvedValue(undefined);
const mockLoadEvaluation = jest.fn().mockResolvedValue(undefined);

jest.mock('../src/store/evaluation', () => ({
  useEvaluationStore: jest.fn(() => ({
    currentEvaluation: {
      id: 'eval-1',
      establecimiento: 'CESFAM Test',
      status: 'draft',
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
    },
    tasas: [],
    isLoading: false,
    saveTasas: mockSaveTasas,
    loadEvaluation: mockLoadEvaluation,
  })),
}));

import { ResultadosScreen } from '../src/screens/ResultadosScreen';

describe('ResultadosScreen', () => {
  const defaultProps = {
    evaluationId: 'eval-1',
    onNavigateToEvaluation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header title', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('Indicadores de Resultado')).toBeTruthy();
  });

  it('renders the header subtitle', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('Pre-carga de datos estadísticos del establecimiento.')).toBeTruthy();
  });

  it('renders the info banner', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('La tasa será calculada automáticamente en la planilla Excel final.')).toBeTruthy();
  });

  it('renders the Asma tasa block', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('Asma')).toBeTruthy();
  });

  it('renders the EPOC tasa block', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('EPOC')).toBeTruthy();
  });

  it('renders the Coberturas tasa block', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('Coberturas')).toBeTruthy();
  });

  it('renders numerador and denominador labels for each block', () => {
    const { getAllByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getAllByText('Numerador').length).toBe(3);
    expect(getAllByText('Denominador').length).toBe(3);
  });

  it('renders the Continuar button', () => {
    const { getByText } = render(<ResultadosScreen {...defaultProps} />);
    expect(getByText('Continuar a Evaluación en Terreno')).toBeTruthy();
  });

  it('calls onNavigateToEvaluation when Continuar pressed', () => {
    const onNavigateToEvaluation = jest.fn();
    const { getByText } = render(
      <ResultadosScreen {...defaultProps} onNavigateToEvaluation={onNavigateToEvaluation} />
    );
    fireEvent.press(getByText('Continuar a Evaluación en Terreno'));
    expect(onNavigateToEvaluation).toHaveBeenCalledWith('eval-1');
  });

  it('calls saveTasas when numerador input changes', async () => {
    const { getAllByPlaceholderText } = render(<ResultadosScreen {...defaultProps} />);
    const inputs = getAllByPlaceholderText('0');
    fireEvent.changeText(inputs[0], '10');

    await waitFor(() => {
      expect(mockSaveTasas).toHaveBeenCalledWith('asma', 10, null);
    });
  });

  it('calls saveTasas when denominador input changes', async () => {
    const { getAllByPlaceholderText } = render(<ResultadosScreen {...defaultProps} />);
    const inputs = getAllByPlaceholderText('0');
    fireEvent.changeText(inputs[1], '200');

    await waitFor(() => {
      expect(mockSaveTasas).toHaveBeenCalledWith('asma', null, 200);
    });
  });

  it('loads evaluation on mount', () => {
    render(<ResultadosScreen {...defaultProps} />);
    expect(mockLoadEvaluation).toHaveBeenCalledWith('eval-1');
  });
});

describe('ResultadosScreen with existing tasas', () => {
  const defaultProps = {
    evaluationId: 'eval-1',
    onNavigateToEvaluation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useEvaluationStore } = require('../src/store/evaluation');
    (useEvaluationStore as jest.Mock).mockReturnValue({
      currentEvaluation: {
        id: 'eval-1',
        establecimiento: 'CESFAM Test',
        status: 'draft',
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
      },
      tasas: [
        { id: 1, evaluation_id: 'eval-1', tipo: 'asma', numerador: 10, denominador: 200 },
        { id: 2, evaluation_id: 'eval-1', tipo: 'epoc', numerador: 5, denominador: 100 },
        { id: 3, evaluation_id: 'eval-1', tipo: 'cobertura_vnc', numerador: 50, denominador: 500 },
      ],
      isLoading: false,
      saveTasas: mockSaveTasas,
      loadEvaluation: mockLoadEvaluation,
    });
  });

  it('pre-populates fields from existing tasas', () => {
    const { getAllByPlaceholderText } = render(<ResultadosScreen {...defaultProps} />);
    const inputs = getAllByPlaceholderText('0');

    expect(inputs[0].props.value).toBe('10');
    expect(inputs[1].props.value).toBe('200');
    expect(inputs[2].props.value).toBe('5');
    expect(inputs[3].props.value).toBe('100');
    expect(inputs[4].props.value).toBe('50');
    expect(inputs[5].props.value).toBe('500');
  });
});
