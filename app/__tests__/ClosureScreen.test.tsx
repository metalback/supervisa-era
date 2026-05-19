import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockSaveCompromisos = jest.fn().mockResolvedValue(undefined);
const mockSaveEmailDestinatario = jest.fn().mockResolvedValue(undefined);
const mockLoadEvaluation = jest.fn().mockResolvedValue(undefined);
const mockSetStatus = jest.fn().mockResolvedValue(undefined);

const mockItems = Array.from({ length: 33 }, (_, i) => ({
  id: i + 1,
  evaluation_id: 'eval-1',
  item_numero: i + 1,
  categoria: i < 12 ? 'estructura' : 'procesos',
  puntaje: i < 30 ? 1 : null,
  observacion: i < 3 ? 'Test observation' : null,
}));

jest.mock('../src/store/evaluation', () => ({
  useEvaluationStore: jest.fn(() => ({
    currentEvaluation: {
      id: 'eval-1',
      establecimiento: 'CESFAM Test',
      codigo_deis: '112233',
      status: 'complete',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      fecha: '2026-01-15',
      compromisos: null,
      email_destinatario: null,
    },
    items: mockItems,
    tasas: [],
    isLoading: false,
    loadEvaluation: mockLoadEvaluation,
    saveCompromisos: mockSaveCompromisos,
    saveEmailDestinatario: mockSaveEmailDestinatario,
    setStatus: mockSetStatus,
  })),
}));

jest.mock('../src/services/sync', () => ({
  checkConnectivity: jest.fn().mockResolvedValue(true),
  queueForSync: jest.fn().mockResolvedValue(undefined),
  onConnectivityChange: jest.fn(),
  startConnectivityListener: jest.fn(),
  stopConnectivityListener: jest.fn(),
  drainSyncQueue: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/services/api', () => ({
  generateExcel: jest.fn().mockResolvedValue(new Blob()),
  buildPayload: jest.fn().mockReturnValue({}),
  setApiBaseUrl: jest.fn(),
  getApiBaseUrl: jest.fn().mockReturnValue('http://localhost:8000'),
}));

jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file://cache/',
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  EncodingType: { Base64: 'base64' },
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn().mockResolvedValue(undefined),
}));

import { ClosureScreen } from '../src/screens/ClosureScreen';

describe('ClosureScreen', () => {
  const mockRoute = { key: 'Closure', name: 'Closure' as const, params: { evaluationId: 'eval-1' } };
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen title', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Cierre de Evaluación')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText(/Revise el resumen/)).toBeTruthy();
  });

  it('renders status banner for online state', async () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByText('Sistema en línea - Sincronizado')).toBeTruthy();
    });
  });

  it('renders status banner for offline state', async () => {
    const { checkConnectivity } = require('../src/services/sync');
    (checkConnectivity as jest.Mock).mockResolvedValueOnce(false);
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByText('Sin conexión - Pendiente de envío')).toBeTruthy();
    });
  });

  it('renders Resumen de Evaluación section', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Resumen de Evaluación')).toBeTruthy();
  });

  it('renders establishment name', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('CESFAM Test')).toBeTruthy();
  });

  it('renders codigo DEIS', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Código DEIS: 112233')).toBeTruthy();
  });

  it('renders progress bar with completed count', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('30/33 items')).toBeTruthy();
  });

  it('renders items revisados stat', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('30/33')).toBeTruthy();
    expect(getByText('Items Revisados')).toBeTruthy();
  });

  it('renders observations count', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('3')).toBeTruthy();
    expect(getByText('Observaciones')).toBeTruthy();
  });

  it('renders Finalización de Visita section', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Finalización de Visita')).toBeTruthy();
  });

  it('renders compromisos textarea', () => {
    const { getByTestId } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByTestId('input-compromisos')).toBeTruthy();
  });

  it('renders email destinatario input', () => {
    const { getByTestId } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByTestId('input-email-destinatario')).toBeTruthy();
  });

  it('renders helper texts', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Este texto se incluirá en el reporte final.')).toBeTruthy();
    expect(getByText('Se enviará una copia del reporte a este correo.')).toBeTruthy();
  });

  it('renders Generar y Enviar button', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Generar y Enviar Planilla Excel')).toBeTruthy();
  });

  it('calls saveCompromisos when compromisos text changes', async () => {
    const { getByTestId } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    const textarea = getByTestId('input-compromisos');
    fireEvent.changeText(textarea, 'Nuevo compromiso de prueba');
    await waitFor(() => {
      expect(mockSaveCompromisos).toHaveBeenCalledWith('Nuevo compromiso de prueba');
    });
  });

  it('calls saveEmailDestinatario when email text changes', async () => {
    const { getByTestId } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    const input = getByTestId('input-email-destinatario');
    fireEvent.changeText(input, 'test@example.com');
    await waitFor(() => {
      expect(mockSaveEmailDestinatario).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('loads evaluation on mount', () => {
    render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(mockLoadEvaluation).toHaveBeenCalledWith('eval-1');
  });

  it('renders bottom nav with Cierre tab active', () => {
    const { getByTestId } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByTestId('bottom-nav')).toBeTruthy();
    expect(getByTestId('nav-tab-cierre')).toBeTruthy();
  });

  it('renders Completo status chip', () => {
    const { getByText } = render(
      <ClosureScreen route={mockRoute} navigation={mockNavigation as any} />
    );
    expect(getByText('Completa')).toBeTruthy();
  });
});
