import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createEvaluation as dbCreateEvaluation,
  getEvaluation as dbGetEvaluation,
  getAllEvaluations as dbGetAllEvaluations,
  updateEvaluation as dbUpdateEvaluation,
  deleteEvaluation as dbDeleteEvaluation,
  getTasas as dbGetTasas,
  upsertTasa as dbUpsertTasa,
  getItems as dbGetItems,
  updateItemScore as dbUpdateItemScore,
  updateItemObservation as dbUpdateItemObservation,
  getCompletedItemsCounts as dbGetCompletedItemsCounts,
  type Evaluation,
  type TasaResultado,
  type EvaluacionItem,
} from '../db';

type TasaTipo = 'asma' | 'epoc' | 'cobertura_vnc';

interface EvaluationState {
  currentEvaluation: Evaluation | null;
  evaluationsList: Evaluation[];
  tasas: TasaResultado[];
  items: EvaluacionItem[];
  completedItemsCounts: Record<string, number>;
  isLoading: boolean;

  createEvaluation: () => Promise<string>;
  loadEvaluation: (id: string) => Promise<void>;
  getAllEvaluations: () => Promise<void>;
  saveMetadata: (fields: Partial<Omit<Evaluation, 'id' | 'created_at'>>) => Promise<void>;
  saveTasas: (tipo: TasaTipo, numerador: number | null, denominador: number | null) => Promise<void>;
  saveItemScore: (itemNumero: number, puntaje: 0 | 1 | null) => Promise<void>;
  saveItemObservation: (itemNumero: number, observacion: string | null) => Promise<void>;
  saveCompromisos: (compromisos: string) => Promise<void>;
  saveEmailDestinatario: (email: string) => Promise<void>;
  setStatus: (status: Evaluation['status']) => Promise<void>;
  deleteEvaluation: (id: string) => Promise<void>;
}

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set, get) => {
      async function fetchEvaluationData(id: string) {
        const evaluation = await dbGetEvaluation(id);
        const items = await dbGetItems(id);
        const tasas = await dbGetTasas(id);
        return { currentEvaluation: evaluation, items, tasas };
      }

      return {
        currentEvaluation: null,
        evaluationsList: [],
        tasas: [],
        items: [],
        completedItemsCounts: {},
        isLoading: false,

        createEvaluation: async () => {
          set({ isLoading: true });
          try {
            const id = await dbCreateEvaluation();
            const data = await fetchEvaluationData(id);
            set({ ...data, isLoading: false });
            return id;
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        loadEvaluation: async (id: string) => {
          set({ isLoading: true });
          try {
            const data = await fetchEvaluationData(id);
            set({ ...data, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        getAllEvaluations: async () => {
          set({ isLoading: true });
          try {
            const evaluationsList = await dbGetAllEvaluations();
            const completedItemsCounts = await dbGetCompletedItemsCounts();
            set({ evaluationsList, completedItemsCounts, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        saveMetadata: async (fields) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpdateEvaluation(currentEvaluation.id, fields);
          const updated = await dbGetEvaluation(currentEvaluation.id);
          set({ currentEvaluation: updated });
        },

        saveTasas: async (tipo, numerador, denominador) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpsertTasa(currentEvaluation.id, tipo, numerador, denominador);
          const tasas = await dbGetTasas(currentEvaluation.id);
          set({ tasas });
        },

        saveItemScore: async (itemNumero, puntaje) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpdateItemScore(currentEvaluation.id, itemNumero, puntaje);
          const items = await dbGetItems(currentEvaluation.id);
          const completedItemsCounts = await dbGetCompletedItemsCounts();
          set({ items, completedItemsCounts });
        },

        saveItemObservation: async (itemNumero, observacion) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpdateItemObservation(currentEvaluation.id, itemNumero, observacion);
          const items = await dbGetItems(currentEvaluation.id);
          set({ items });
        },

        saveCompromisos: async (compromisos) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpdateEvaluation(currentEvaluation.id, { compromisos });
          const updated = await dbGetEvaluation(currentEvaluation.id);
          set({ currentEvaluation: updated });
        },

        saveEmailDestinatario: async (email) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpdateEvaluation(currentEvaluation.id, { email_destinatario: email });
          const updated = await dbGetEvaluation(currentEvaluation.id);
          set({ currentEvaluation: updated });
        },

        setStatus: async (status) => {
          const { currentEvaluation } = get();
          if (!currentEvaluation) return;
          await dbUpdateEvaluation(currentEvaluation.id, { status });
          const updated = await dbGetEvaluation(currentEvaluation.id);
          set({ currentEvaluation: updated });
        },

        deleteEvaluation: async (id) => {
          await dbDeleteEvaluation(id);
          const { currentEvaluation } = get();
          if (currentEvaluation?.id === id) {
            set({ currentEvaluation: null, items: [], tasas: [] });
          }
          const evaluationsList = await dbGetAllEvaluations();
          const completedItemsCounts = await dbGetCompletedItemsCounts();
          set({ evaluationsList, completedItemsCounts });
        },
      };
    },
    {
      name: 'evaluation-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentEvaluation: state.currentEvaluation,
        evaluationsList: state.evaluationsList,
        tasas: state.tasas,
        items: state.items,
        completedItemsCounts: state.completedItemsCounts,
      }),
    }
  )
);
