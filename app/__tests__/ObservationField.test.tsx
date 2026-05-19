import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ObservationField } from '../src/components/ObservationField';

describe('ObservationField', () => {
  const defaultProps = {
    value: null as string | null,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle button with Agregar Observación text', () => {
    const { getByText } = render(<ObservationField {...defaultProps} />);
    expect(getByText('Agregar Observación')).toBeTruthy();
  });

  it('does not show textarea when collapsed', () => {
    const { queryByPlaceholderText } = render(<ObservationField {...defaultProps} />);
    expect(queryByPlaceholderText('Escriba los detalles aquí...')).toBeNull();
  });

  it('shows textarea when toggle is pressed', () => {
    const { getByText, getByPlaceholderText } = render(
      <ObservationField {...defaultProps} />
    );
    fireEvent.press(getByText('Agregar Observación'));
    expect(getByPlaceholderText('Escriba los detalles aquí...')).toBeTruthy();
    expect(getByText('Ocultar Observación')).toBeTruthy();
  });

  it('hides textarea when toggle is pressed again', () => {
    const { getByText, queryByPlaceholderText } = render(
      <ObservationField {...defaultProps} />
    );
    fireEvent.press(getByText('Agregar Observación'));
    fireEvent.press(getByText('Ocultar Observación'));
    expect(queryByPlaceholderText('Escriba los detalles aquí...')).toBeNull();
  });

  it('calls onChange when text is entered', () => {
    const { getByText, getByPlaceholderText } = render(
      <ObservationField {...defaultProps} />
    );
    fireEvent.press(getByText('Agregar Observación'));
    fireEvent.changeText(
      getByPlaceholderText('Escriba los detalles aquí...'),
      'Test observation'
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith('Test observation');
  });

  it('starts expanded when value is provided', () => {
    const { getByPlaceholderText, getByText } = render(
      <ObservationField {...defaultProps} value="Existing observation" />
    );
    expect(getByPlaceholderText('Escriba los detalles aquí...')).toBeTruthy();
    expect(getByText('Ocultar Observación')).toBeTruthy();
  });

  it('pre-fills textarea with existing value', () => {
    const { getByDisplayValue } = render(
      <ObservationField {...defaultProps} value="Existing text" />
    );
    expect(getByDisplayValue('Existing text')).toBeTruthy();
  });
});
