import { useAuthStore } from '../src/store/auth';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: false,
      isFirstLaunch: true,
      isLoading: true,
    });
  });

  describe('checkAuthState', () => {
    it('should set isFirstLaunch to true when no PIN exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().checkAuthState();

      const state = useAuthStore.getState();
      expect(state.isFirstLaunch).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should set isFirstLaunch to false when PIN exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      await useAuthStore.getState().checkAuthState();

      const state = useAuthStore.getState();
      expect(state.isFirstLaunch).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should reset to initial state when SecureStore fails', async () => {
      useAuthStore.setState({ isFirstLaunch: false, isAuthenticated: true, isLoading: true });
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('store unavailable'));

      await useAuthStore.getState().checkAuthState();

      const state = useAuthStore.getState();
      expect(state.isFirstLaunch).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setPin', () => {
    it('should store PIN in SecureStore and update state', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await useAuthStore.getState().setPin('1234');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user_pin', '1234');
      const state = useAuthStore.getState();
      expect(state.isFirstLaunch).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('verifyPin', () => {
    it('should return true and set authenticated when PIN matches', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      const result = await useAuthStore.getState().verifyPin('1234');

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should return false and not authenticate when PIN does not match', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      const result = await useAuthStore.getState().verifyPin('5678');

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should set isAuthenticated to false', () => {
      useAuthStore.setState({ isAuthenticated: true });

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
