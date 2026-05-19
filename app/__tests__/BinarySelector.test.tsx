import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BinarySelector } from '../src/components/BinarySelector';

describe('BinarySelector', () => {
  const defaultProps = {
    value: null as 0 | 1 | null,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both Sí and No buttons', () => {
    const { getByText } = render(<BinarySelector {...defaultProps} />);
    expect(getByText('Sí (1)')).toBeTruthy();
    expect(getByText('No (0)')).toBeTruthy();
  });

  it('calls onChange with 1 when Sí is pressed', () => {
    const { getByText } = render(<BinarySelector {...defaultProps} />);
    fireEvent.press(getByText('Sí (1)'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(1);
  });

  it('calls onChange with 0 when No is pressed', () => {
    const { getByText } = render(<BinarySelector {...defaultProps} />);
    fireEvent.press(getByText('No (0)'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(0);
  });

  it('calls onChange with null when active Sí is pressed again', () => {
    const { getByText } = render(<BinarySelector {...defaultProps} value={1} />);
    fireEvent.press(getByText('Sí (1)'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange with null when active No is pressed again', () => {
    const { getByText } = render(<BinarySelector {...defaultProps} value={0} />);
    fireEvent.press(getByText('No (0)'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(null);
  });
});
