import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StatusCard } from '../src/components/StatusCard';

describe('StatusCard', () => {
  const defaultProps = {
    establecimiento: 'CESFAM Central',
    status: 'in_progress' as const,
    completedItems: 14,
    totalItems: 33,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders establishment name', () => {
    const { getByText } = render(<StatusCard {...defaultProps} />);
    expect(getByText('CESFAM Central')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { getByText } = render(<StatusCard {...defaultProps} />);
    expect(getByText('En Proceso')).toBeTruthy();
  });

  it('renders progress bar', () => {
    const { getByText } = render(<StatusCard {...defaultProps} />);
    expect(getByText('14/33 items')).toBeTruthy();
  });

  it('renders Sin nombre when establishment is empty', () => {
    const { getByText } = render(<StatusCard {...defaultProps} establecimiento="" />);
    expect(getByText('Sin nombre')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByText } = render(<StatusCard {...defaultProps} />);
    fireEvent.press(getByText('CESFAM Central'));
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders sync date for sent status', () => {
    const { getByText } = render(
      <StatusCard {...defaultProps} status="sent" syncDate="19/5/2026" />
    );
    expect(getByText('Sincronizado: 19/5/2026')).toBeTruthy();
  });

  it('renders cloud-off for draft status', () => {
    const { getByText } = render(<StatusCard {...defaultProps} status="draft" />);
    expect(getByText('Sin sincronizar')).toBeTruthy();
  });
});
