import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusChip } from '../src/components/StatusChip';

describe('StatusChip', () => {
  it('renders Pendiente for draft status', () => {
    const { getByText } = render(<StatusChip status="draft" />);
    expect(getByText('Pendiente')).toBeTruthy();
  });

  it('renders En Proceso for in_progress status', () => {
    const { getByText } = render(<StatusChip status="in_progress" />);
    expect(getByText('En Proceso')).toBeTruthy();
  });

  it('renders Enviada for sent status', () => {
    const { getByText } = render(<StatusChip status="sent" />);
    expect(getByText('Enviada')).toBeTruthy();
  });
});
