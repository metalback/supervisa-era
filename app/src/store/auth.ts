import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin';

interface AuthState {
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  isLoading: boolean;
  checkAuthState: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isFirstLaunch: true,
  isLoading: true,

  checkAuthState: async () => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      set({
        isFirstLaunch: storedPin === null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setPin: async (pin: string) => {
    await SecureStore.setItemAsync(PIN_KEY, pin);
    set({ isFirstLaunch: false, isAuthenticated: true });
  },

  verifyPin: async (pin: string) => {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    if (storedPin === pin) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false });
  },
}));
