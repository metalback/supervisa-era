import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SectionCard } from '../src/components/SectionCard';

describe('SectionCard', () => {
  it('renders title', () => {
    const { getByText } = render(
      <SectionCard title="Test Section" iconName="domain">
        <Text>Child content</Text>
      </SectionCard>
    );
    expect(getByText('Test Section')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(
      <SectionCard title="Section" iconName="domain">
        <Text>Child content</Text>
      </SectionCard>
    );
    expect(getByText('Child content')).toBeTruthy();
  });

  it('renders with custom icon', () => {
    const { getByText } = render(
      <SectionCard title="Custom Icon" iconName="chart-bar">
        <Text>Content</Text>
      </SectionCard>
    );
    expect(getByText('Custom Icon')).toBeTruthy();
  });

  it('renders with custom icon color', () => {
    const { getByText } = render(
      <SectionCard title="Colored" iconName="account-tie" iconColor="#ff0000">
        <Text>Content</Text>
      </SectionCard>
    );
    expect(getByText('Colored')).toBeTruthy();
  });
});
