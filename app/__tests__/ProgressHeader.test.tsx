import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressHeader } from '../src/components/ProgressHeader';

describe('ProgressHeader', () => {
  it('renders Avance General label', () => {
    const { getByText } = render(<ProgressHeader completed={0} total={33} />);
    expect(getByText('Avance General')).toBeTruthy();
  });

  it('renders completed count', () => {
    const { getByText } = render(<ProgressHeader completed={14} total={33} />);
    expect(getByText('14/33 Completados')).toBeTruthy();
  });

  it('renders zero completed', () => {
    const { getByText } = render(<ProgressHeader completed={0} total={33} />);
    expect(getByText('0/33 Completados')).toBeTruthy();
  });

  it('renders full completed', () => {
    const { getByText } = render(<ProgressHeader completed={33} total={33} />);
    expect(getByText('33/33 Completados')).toBeTruthy();
  });
});
