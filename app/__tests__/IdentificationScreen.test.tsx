import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockLoadEvaluation = jest.fn().mockResolvedValue(undefined);
const mockSaveMetadata = jest.fn().mockResolvedValue(undefined);

const mockEvaluation = {
  id: 'eval-1',
  establecimiento: 'CESFAM Test',
  status: 'draft' as const,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  fecha: '2026-01-15',
  region: 'metropolitana',
  comuna: 'Santiago',
  codigo_deis: '112233',
  director: 'Juan Perez',
  encargado_era: 'Maria Lopez',
  poblacion_rem_p3: 500,
  horas_administrativas: 40,
  email_contacto: 'test@cesfam.cl',
  compromisos: null,
};

jest.mock('../src/store/evaluation', () => ({
  useEvaluationStore: jest.fn(() => ({
    currentEvaluation: mockEvaluation,
    isLoading: false,
    loadEvaluation: mockLoadEvaluation,
    saveMetadata: mockSaveMetadata,
  })),
}));

jest.mock('../src/db', () => ({
  createEvaluation: jest.fn().mockResolvedValue('eval-1'),
  getEvaluation: jest.fn().mockResolvedValue(null),
  getAllEvaluations: jest.fn().mockResolvedValue([]),
  updateEvaluation: jest.fn().mockResolvedValue(undefined),
  deleteEvaluation: jest.fn().mockResolvedValue(undefined),
  getTasas: jest.fn().mockResolvedValue([]),
  upsertTasa: jest.fn().mockResolvedValue(undefined),
  getItems: jest.fn().mockResolvedValue([]),
  updateItemScore: jest.fn().mockResolvedValue(undefined),
  updateItemObservation: jest.fn().mockResolvedValue(undefined),
  getCompletedItemsCounts: jest.fn().mockResolvedValue({}),
}));

import { IdentificationScreen } from '../src/screens/IdentificationScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  params: { evaluationId: 'eval-1' },
  key: 'Identification',
  name: 'Identification' as const,
};

describe('IdentificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen title', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Identificación del Establecimiento')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Ingrese los datos base para iniciar la evaluación estructural.')).toBeTruthy();
  });

  it('renders section headers', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Antecedentes Generales')).toBeTruthy();
    expect(getByText('Datos REM')).toBeTruthy();
    expect(getByText('Datos de Gestión')).toBeTruthy();
    expect(getByText('Información de Contacto')).toBeTruthy();
  });

  it('renders all form fields', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Fecha de Registro')).toBeTruthy();
    expect(getByText('Código DEIS')).toBeTruthy();
    expect(getByText('Región')).toBeTruthy();
    expect(getByText('Comuna')).toBeTruthy();
    expect(getByText('Nombre del Establecimiento')).toBeTruthy();
    expect(getByText('Población bajo control ERA')).toBeTruthy();
    expect(getByText('Horas Administrativas Mensuales')).toBeTruthy();
    expect(getByText('Nombre Director(a)')).toBeTruthy();
    expect(getByText('Nombre Encargado(a) Sala ERA')).toBeTruthy();
    expect(getByText('Email Institucional de Contacto')).toBeTruthy();
  });

  it('renders continue button', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Continuar a Indicadores')).toBeTruthy();
  });

  it('renders bottom navigation with 5 tabs', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Identificación')).toBeTruthy();
    expect(getByText('Resultados')).toBeTruthy();
    expect(getByText('Estructura')).toBeTruthy();
    expect(getByText('Procesos')).toBeTruthy();
    expect(getByText('Cierre')).toBeTruthy();
  });

  it('loads evaluation on mount', () => {
    render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(mockLoadEvaluation).toHaveBeenCalledWith('eval-1');
  });

  it('pre-populates form with existing evaluation data', () => {
    const { getByDisplayValue } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByDisplayValue('CESFAM Test')).toBeTruthy();
    expect(getByDisplayValue('112233')).toBeTruthy();
    expect(getByDisplayValue('Juan Perez')).toBeTruthy();
    expect(getByDisplayValue('Maria Lopez')).toBeTruthy();
    expect(getByDisplayValue('500')).toBeTruthy();
    expect(getByDisplayValue('40')).toBeTruthy();
    expect(getByDisplayValue('test@cesfam.cl')).toBeTruthy();
  });

  it('renders helper text for email', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Este correo recibirá la copia del informe final.')).toBeTruthy();
  });

  it('renders hrs suffix for horas field', () => {
    const { getByText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('hrs')).toBeTruthy();
  });

  it('saves metadata when establecimiento changes', async () => {
    const { getByTestId } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    fireEvent.changeText(getByTestId('input-establecimiento'), 'Nuevo CESFAM');
    await waitFor(() => {
      expect(mockSaveMetadata).toHaveBeenCalledWith(
        expect.objectContaining({ establecimiento: 'Nuevo CESFAM' })
      );
    });
  });

  it('saves metadata when codigo DEIS changes', async () => {
    const { getByTestId } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    fireEvent.changeText(getByTestId('input-codigo-deis'), '999888');
    await waitFor(() => {
      expect(mockSaveMetadata).toHaveBeenCalledWith(
        expect.objectContaining({ codigo_deis: '999888' })
      );
    });
  });

  it('renders fecha as read-only', () => {
    const { getByTestId } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    const fechaInput = getByTestId('input-fecha');
    expect(fechaInput.props.editable).toBe(false);
  });
});

describe('IdentificationScreen with empty evaluation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useEvaluationStore } = require('../src/store/evaluation');
    (useEvaluationStore as jest.Mock).mockReturnValue({
      currentEvaluation: {
        ...mockEvaluation,
        establecimiento: null,
        codigo_deis: null,
        region: null,
        comuna: null,
        director: null,
        encargado_era: null,
        poblacion_rem_p3: null,
        horas_administrativas: null,
        email_contacto: null,
      },
      isLoading: false,
      loadEvaluation: mockLoadEvaluation,
      saveMetadata: mockSaveMetadata,
    });
  });

  it('renders placeholders when evaluation has no data', () => {
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <IdentificationScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByPlaceholderText('Ej. 112233')).toBeTruthy();
    expect(getByPlaceholderText('Nombre oficial del CESFAM, CECOSF, etc.')).toBeTruthy();
    const nombreFields = getAllByPlaceholderText('Nombre completo');
    expect(nombreFields.length).toBe(2);
    expect(getByPlaceholderText('correo@institucion.cl')).toBeTruthy();
  });
});
