jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
  }),
}));

jest.mock('../src/db', () => ({
  getSyncQueue: jest.fn().mockResolvedValue([]),
  removeSyncQueueEntry: jest.fn().mockResolvedValue(undefined),
  incrementSyncAttempts: jest.fn().mockResolvedValue(undefined),
  addToSyncQueue: jest.fn().mockResolvedValue(undefined),
  updateEvaluation: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/services/api', () => ({
  generateExcel: jest.fn().mockResolvedValue(new Blob()),
}));

import {
  checkConnectivity,
  onConnectivityChange,
  startConnectivityListener,
  stopConnectivityListener,
  drainSyncQueue,
  queueForSync,
} from '../src/services/sync';
import * as db from '../src/db';
import { generateExcel } from '../src/services/api';

describe('sync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stopConnectivityListener();
  });

  describe('checkConnectivity', () => {
    it('returns true when connected and reachable', async () => {
      const result = await checkConnectivity();
      expect(result).toBe(true);
    });

    it('returns false when not connected', async () => {
      const NetInfo = require('@react-native-community/netinfo');
      NetInfo.fetch.mockResolvedValueOnce({
        isConnected: false,
        isInternetReachable: false,
      });
      const result = await checkConnectivity();
      expect(result).toBe(false);
    });

    it('returns false when internet not reachable', async () => {
      const NetInfo = require('@react-native-community/netinfo');
      NetInfo.fetch.mockResolvedValueOnce({
        isConnected: true,
        isInternetReachable: false,
      });
      const result = await checkConnectivity();
      expect(result).toBe(false);
    });
  });

  describe('onConnectivityChange', () => {
    it('registers and unregisters listeners', () => {
      const listener = jest.fn();
      const unsubscribe = onConnectivityChange(listener);
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });

  describe('drainSyncQueue', () => {
    it('processes queue entries successfully', async () => {
      (db.getSyncQueue as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          evaluation_id: 'eval-1',
          payload: JSON.stringify({ metadata: {}, cierre: {} }),
          created_at: '2026-01-01T00:00:00.000Z',
          intentos: 0,
        },
      ]);

      await drainSyncQueue();

      expect(generateExcel).toHaveBeenCalled();
      expect(db.removeSyncQueueEntry).toHaveBeenCalledWith(1);
      expect(db.updateEvaluation).toHaveBeenCalledWith('eval-1', {
        status: 'sent',
        updated_at: expect.any(String),
      });
    });

    it('increments attempts on failure', async () => {
      (db.getSyncQueue as jest.Mock).mockResolvedValueOnce([
        {
          id: 2,
          evaluation_id: 'eval-2',
          payload: JSON.stringify({ metadata: {}, cierre: {} }),
          created_at: '2026-01-01T00:00:00.000Z',
          intentos: 0,
        },
      ]);
      (generateExcel as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await drainSyncQueue();

      expect(db.incrementSyncAttempts).toHaveBeenCalledWith(2);
      expect(db.removeSyncQueueEntry).not.toHaveBeenCalled();
    });

    it('skips entries with max attempts', async () => {
      (db.getSyncQueue as jest.Mock).mockResolvedValueOnce([
        {
          id: 3,
          evaluation_id: 'eval-3',
          payload: JSON.stringify({ metadata: {}, cierre: {} }),
          created_at: '2026-01-01T00:00:00.000Z',
          intentos: 3,
        },
      ]);

      await drainSyncQueue();

      expect(generateExcel).not.toHaveBeenCalled();
      expect(db.removeSyncQueueEntry).not.toHaveBeenCalled();
    });

    it('does not re-enter when already syncing', async () => {
      (db.getSyncQueue as jest.Mock).mockResolvedValue([
        {
          id: 4,
          evaluation_id: 'eval-4',
          payload: JSON.stringify({ metadata: {}, cierre: {} }),
          created_at: '2026-01-01T00:00:00.000Z',
          intentos: 0,
        },
      ]);

      const promise1 = drainSyncQueue();
      const promise2 = drainSyncQueue();
      await Promise.all([promise1, promise2]);

      expect(db.getSyncQueue).toHaveBeenCalledTimes(1);
    });
  });

  describe('queueForSync', () => {
    it('adds payload to sync queue', async () => {
      await queueForSync('eval-1', { metadata: {}, cierre: {} } as any);
      expect(db.addToSyncQueue).toHaveBeenCalledWith(
        'eval-1',
        expect.any(String)
      );
    });
  });
});
