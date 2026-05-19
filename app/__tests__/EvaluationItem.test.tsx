import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EvaluationItem } from '../src/components/EvaluationItem';

describe('EvaluationItem', () => {
  const defaultProps = {
    itemNumero: 1,
    label: 'Test item label',
    puntaje: null as 0 | 1 | null,
    observacion: null as string | null,
    onScoreChange: jest.fn(),
    onObservationChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders item number', () => {
    const { getByText } = render(<EvaluationItem {...defaultProps} />);
    expect(getByText('1.1')).toBeTruthy();
  });

  it('renders item label', () => {
    const { getByText } = render(<EvaluationItem {...defaultProps} />);
    expect(getByText('Test item label')).toBeTruthy();
  });

  it('renders BinarySelector', () => {
    const { getByText } = render(<EvaluationItem {...defaultProps} />);
    expect(getByText('Sí (1)')).toBeTruthy();
    expect(getByText('No (0)')).toBeTruthy();
  });

  it('renders ObservationField toggle', () => {
    const { getByText } = render(<EvaluationItem {...defaultProps} />);
    expect(getByText('Agregar Observación')).toBeTruthy();
  });

  it('calls onScoreChange when BinarySelector changes', () => {
    const { getByText } = render(<EvaluationItem {...defaultProps} />);
    fireEvent.press(getByText('Sí (1)'));
    expect(defaultProps.onScoreChange).toHaveBeenCalledWith(1);
  });

  it('calls onObservationChange when observation text changes', () => {
    const { getByText, getByPlaceholderText } = render(
      <EvaluationItem {...defaultProps} />
    );
    fireEvent.press(getByText('Agregar Observación'));
    fireEvent.changeText(
      getByPlaceholderText('Escriba los detalles aquí...'),
      'New observation'
    );
    expect(defaultProps.onObservationChange).toHaveBeenCalledWith('New observation');
  });

  it('displays existing score', () => {
    const { getByText } = render(<EvaluationItem {...defaultProps} puntaje={1} />);
    expect(getByText('Sí (1)')).toBeTruthy();
  });

  it('displays existing observation when expanded', () => {
    const { getByDisplayValue } = render(
      <EvaluationItem {...defaultProps} observacion="Existing note" />
    );
    expect(getByDisplayValue('Existing note')).toBeTruthy();
  });
});
