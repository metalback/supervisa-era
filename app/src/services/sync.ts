import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import {
  getSyncQueue,
  removeSyncQueueEntry,
  incrementSyncAttempts,
  addToSyncQueue,
  updateEvaluation,
  type SyncQueueEntry,
} from '../db';
import { generateExcel, type EvaluacionPayload } from './api';

const MAX_ATTEMPTS = 3;

type ConnectivityListener = (isConnected: boolean) => void;

let unsubscribe: (() => void) | null = null;
let isSyncing = false;
let listeners: ConnectivityListener[] = [];

export function onConnectivityChange(listener: ConnectivityListener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners(isConnected: boolean) {
  for (const listener of listeners) {
    listener(isConnected);
  }
}

export async function drainSyncQueue(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const queue = await getSyncQueue();
    for (const entry of queue) {
      if (entry.intentos >= MAX_ATTEMPTS) {
        continue;
      }

      try {
        const payload: EvaluacionPayload = JSON.parse(entry.payload);
        await generateExcel(payload);
        await removeSyncQueueEntry(entry.id);
        await updateEvaluation(entry.evaluation_id, {
          status: 'sent',
          updated_at: new Date().toISOString(),
        });
      } catch {
        await incrementSyncAttempts(entry.id);
      }
    }
  } finally {
    isSyncing = false;
  }
}

export function startConnectivityListener(): void {
  if (unsubscribe) return;

  unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    const isConnected = state.isConnected === true && state.isInternetReachable !== false;
    notifyListeners(isConnected);

    if (isConnected) {
      drainSyncQueue();
    }
  });
}

export function stopConnectivityListener(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

export async function checkConnectivity(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
}

export async function queueForSync(
  evaluationId: string,
  payload: EvaluacionPayload
): Promise<void> {
  await addToSyncQueue(evaluationId, JSON.stringify(payload));
}
