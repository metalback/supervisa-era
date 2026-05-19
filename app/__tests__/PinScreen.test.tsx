import { useAuthStore } from '../src/store/auth';
import { PinScreen } from '../src/screens/PinScreen';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../src/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

describe('PinScreen', () => {
  const mockSetPin = jest.fn();
  const mockVerifyPin = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      setPin: mockSetPin,
      verifyPin: mockVerifyPin,
    });
  });

  describe('Create mode', () => {
    it('should render title for PIN creation', () => {
      const { getByText } = render(
        <PinScreen mode="create" onSuccess={mockOnSuccess} />
      );

      expect(getByText('Crear PIN')).toBeTruthy();
    });

    it('should render subtitle instructing to enter 4 digits', () => {
      const { getByText } = render(
        <PinScreen mode="create" onSuccess={mockOnSuccess} />
      );

      expect(getByText('Ingresa un PIN de 4 dígitos')).toBeTruthy();
    });

    it('should render numeric keypad with digits 0-9', () => {
      const { getByText } = render(
        <PinScreen mode="create" onSuccess={mockOnSuccess} />
      );

      for (let i = 0; i <= 9; i++) {
        expect(getByText(String(i))).toBeTruthy();
      }
    });

    it('should call setPin after entering 4 digits', async () => {
      mockSetPin.mockResolvedValue(undefined);

      const { getByLabelText } = render(
        <PinScreen mode="create" onSuccess={mockOnSuccess} />
      );

      await act(async () => {
        fireEvent.press(getByLabelText('digit-1'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-2'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-3'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-4'));
      });

      await waitFor(() => {
        expect(mockSetPin).toHaveBeenCalledWith('1234');
      });
    });

    it('should call onSuccess after PIN is set', async () => {
      mockSetPin.mockResolvedValue(undefined);

      const { getByLabelText } = render(
        <PinScreen mode="create" onSuccess={mockOnSuccess} />
      );

      await act(async () => {
        fireEvent.press(getByLabelText('digit-1'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-2'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-3'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-4'));
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Verify mode', () => {
    it('should render title for PIN verification', () => {
      const { getByText } = render(
        <PinScreen mode="verify" onSuccess={mockOnSuccess} />
      );

      expect(getByText('Ingresa tu PIN')).toBeTruthy();
    });

    it('should show error for wrong PIN', async () => {
      mockVerifyPin.mockResolvedValue(false);

      const { getByLabelText, findByText } = render(
        <PinScreen mode="verify" onSuccess={mockOnSuccess} />
      );

      await act(async () => {
        fireEvent.press(getByLabelText('digit-5'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-6'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-7'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-8'));
      });

      const errorText = await findByText('PIN incorrecto');
      expect(errorText).toBeTruthy();
    });

    it('should call onSuccess for correct PIN', async () => {
      mockVerifyPin.mockResolvedValue(true);

      const { getByLabelText } = render(
        <PinScreen mode="verify" onSuccess={mockOnSuccess} />
      );

      await act(async () => {
        fireEvent.press(getByLabelText('digit-1'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-2'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-3'));
      });
      await act(async () => {
        fireEvent.press(getByLabelText('digit-4'));
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Delete button', () => {
    it('should render delete button', () => {
      const { getByLabelText } = render(
        <PinScreen mode="create" onSuccess={mockOnSuccess} />
      );

      expect(getByLabelText('delete')).toBeTruthy();
    });
  });
});
