import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressBar } from '../src/components/ProgressBar';

describe('ProgressBar', () => {
  it('renders correct item count label', () => {
    const { getByText } = render(<ProgressBar completed={14} total={33} />);
    expect(getByText('14/33 items')).toBeTruthy();
  });

  it('renders zero progress', () => {
    const { getByText } = render(<ProgressBar completed={0} total={33} />);
    expect(getByText('0/33 items')).toBeTruthy();
  });

  it('renders full progress', () => {
    const { getByText } = render(<ProgressBar completed={33} total={33} />);
    expect(getByText('33/33 items')).toBeTruthy();
  });
});
