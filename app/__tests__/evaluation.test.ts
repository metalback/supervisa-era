import { useEvaluationStore } from '../src/store/evaluation';
import type { Evaluation, TasaResultado, EvaluacionItem } from '../src/db';

const mockEvaluation: Evaluation = {
  id: 'test-uuid-1',
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
  email_destinatario: null,
};

const mockItems: EvaluacionItem[] = [
  { id: 1, evaluation_id: 'test-uuid-1', item_numero: 1, categoria: 'estructura', puntaje: null, observacion: null },
  { id: 2, evaluation_id: 'test-uuid-1', item_numero: 2, categoria: 'estructura', puntaje: null, observacion: null },
];

const mockTasas: TasaResultado[] = [
  { id: 1, evaluation_id: 'test-uuid-1', tipo: 'asma', numerador: null, denominador: null },
];

jest.mock('../src/db', () => ({
  createEvaluation: jest.fn().mockResolvedValue('test-uuid-1'),
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

import * as db from '../src/db';

describe('Evaluation Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useEvaluationStore.setState({
      currentEvaluation: null,
      evaluationsList: [],
      tasas: [],
      items: [],
      isLoading: false,
    });
  });

  describe('createEvaluation', () => {
    it('should create evaluation and load its data', async () => {
      (db.createEvaluation as jest.Mock).mockResolvedValue('test-uuid-1');
      (db.getEvaluation as jest.Mock).mockResolvedValue(mockEvaluation);
      (db.getItems as jest.Mock).mockResolvedValue(mockItems);
      (db.getTasas as jest.Mock).mockResolvedValue(mockTasas);

      const id = await useEvaluationStore.getState().createEvaluation();

      expect(id).toBe('test-uuid-1');
      expect(db.createEvaluation).toHaveBeenCalled();
      const state = useEvaluationStore.getState();
      expect(state.currentEvaluation).toEqual(mockEvaluation);
      expect(state.items).toEqual(mockItems);
      expect(state.tasas).toEqual(mockTasas);
      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading during creation', async () => {
      let resolveCreate: (v: string) => void;
      (db.createEvaluation as jest.Mock).mockReturnValue(
        new Promise((resolve) => { resolveCreate = resolve; })
      );

      const promise = useEvaluationStore.getState().createEvaluation();
      expect(useEvaluationStore.getState().isLoading).toBe(true);

      resolveCreate!('test-uuid-1');
      (db.getEvaluation as jest.Mock).mockResolvedValue(mockEvaluation);
      (db.getItems as jest.Mock).mockResolvedValue([]);
      (db.getTasas as jest.Mock).mockResolvedValue([]);
      await promise;

      expect(useEvaluationStore.getState().isLoading).toBe(false);
    });
  });

  describe('loadEvaluation', () => {
    it('should load evaluation by id', async () => {
      (db.getEvaluation as jest.Mock).mockResolvedValue(mockEvaluation);
      (db.getItems as jest.Mock).mockResolvedValue(mockItems);
      (db.getTasas as jest.Mock).mockResolvedValue(mockTasas);

      await useEvaluationStore.getState().loadEvaluation('test-uuid-1');

      const state = useEvaluationStore.getState();
      expect(state.currentEvaluation).toEqual(mockEvaluation);
      expect(state.items).toEqual(mockItems);
      expect(state.tasas).toEqual(mockTasas);
    });
  });

  describe('getAllEvaluations', () => {
    it('should load all evaluations', async () => {
      (db.getAllEvaluations as jest.Mock).mockResolvedValue([mockEvaluation]);

      await useEvaluationStore.getState().getAllEvaluations();

      expect(useEvaluationStore.getState().evaluationsList).toEqual([mockEvaluation]);
    });
  });

  describe('saveMetadata', () => {
    it('should update current evaluation metadata', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      const updated = { ...mockEvaluation, establecimiento: 'CESFAM Updated' };
      (db.getEvaluation as jest.Mock).mockResolvedValue(updated);

      await useEvaluationStore.getState().saveMetadata({ establecimiento: 'CESFAM Updated' });

      expect(db.updateEvaluation).toHaveBeenCalledWith('test-uuid-1', { establecimiento: 'CESFAM Updated' });
      expect(useEvaluationStore.getState().currentEvaluation?.establecimiento).toBe('CESFAM Updated');
    });

    it('should do nothing if no current evaluation', async () => {
      await useEvaluationStore.getState().saveMetadata({ establecimiento: 'test' });
      expect(db.updateEvaluation).not.toHaveBeenCalled();
    });
  });

  describe('saveTasas', () => {
    it('should upsert tasa and reload', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      const updatedTasas = [{ ...mockTasas[0], numerador: 10, denominador: 100 }];
      (db.getTasas as jest.Mock).mockResolvedValue(updatedTasas);

      await useEvaluationStore.getState().saveTasas('asma', 10, 100);

      expect(db.upsertTasa).toHaveBeenCalledWith('test-uuid-1', 'asma', 10, 100);
      expect(useEvaluationStore.getState().tasas).toEqual(updatedTasas);
    });
  });

  describe('saveItemScore', () => {
    it('should update item score and reload items', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      const updatedItems = [{ ...mockItems[0], puntaje: 1 }];
      (db.getItems as jest.Mock).mockResolvedValue(updatedItems);

      await useEvaluationStore.getState().saveItemScore(1, 1);

      expect(db.updateItemScore).toHaveBeenCalledWith('test-uuid-1', 1, 1);
    });
  });

  describe('saveItemObservation', () => {
    it('should update item observation and reload items', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });

      await useEvaluationStore.getState().saveItemObservation(1, 'test observation');

      expect(db.updateItemObservation).toHaveBeenCalledWith('test-uuid-1', 1, 'test observation');
    });
  });

  describe('saveCompromisos', () => {
    it('should update compromisos on current evaluation', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      const updated = { ...mockEvaluation, compromisos: 'test compromisos' };
      (db.getEvaluation as jest.Mock).mockResolvedValue(updated);

      await useEvaluationStore.getState().saveCompromisos('test compromisos');

      expect(db.updateEvaluation).toHaveBeenCalledWith('test-uuid-1', { compromisos: 'test compromisos' });
      expect(useEvaluationStore.getState().currentEvaluation?.compromisos).toBe('test compromisos');
    });
  });

  describe('setStatus', () => {
    it('should update evaluation status', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      const updated = { ...mockEvaluation, status: 'in_progress' as const };
      (db.getEvaluation as jest.Mock).mockResolvedValue(updated);

      await useEvaluationStore.getState().setStatus('in_progress');

      expect(db.updateEvaluation).toHaveBeenCalledWith('test-uuid-1', { status: 'in_progress' });
      expect(useEvaluationStore.getState().currentEvaluation?.status).toBe('in_progress');
    });
  });

  describe('deleteEvaluation', () => {
    it('should delete evaluation and clear current if same id', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      (db.getAllEvaluations as jest.Mock).mockResolvedValue([]);

      await useEvaluationStore.getState().deleteEvaluation('test-uuid-1');

      expect(db.deleteEvaluation).toHaveBeenCalledWith('test-uuid-1');
      expect(useEvaluationStore.getState().currentEvaluation).toBeNull();
      expect(useEvaluationStore.getState().items).toEqual([]);
      expect(useEvaluationStore.getState().tasas).toEqual([]);
    });

    it('should delete evaluation without clearing current if different id', async () => {
      useEvaluationStore.setState({ currentEvaluation: mockEvaluation });
      (db.getAllEvaluations as jest.Mock).mockResolvedValue([]);

      await useEvaluationStore.getState().deleteEvaluation('other-id');

      expect(useEvaluationStore.getState().currentEvaluation).toEqual(mockEvaluation);
    });
  });
});
