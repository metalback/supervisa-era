import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomNav } from '../src/components/BottomNav';

describe('BottomNav', () => {
  it('renders all 5 tabs', () => {
    const { getByText } = render(
      <BottomNav activeTab="identificacion" onTabPress={() => {}} />
    );
    expect(getByText('Identificación')).toBeTruthy();
    expect(getByText('Resultados')).toBeTruthy();
    expect(getByText('Estructura')).toBeTruthy();
    expect(getByText('Procesos')).toBeTruthy();
    expect(getByText('Cierre')).toBeTruthy();
  });

  it('calls onTabPress when tab is pressed', () => {
    const onTabPress = jest.fn();
    const { getByTestId } = render(
      <BottomNav activeTab="identificacion" onTabPress={onTabPress} />
    );
    fireEvent.press(getByTestId('nav-tab-resultados'));
    expect(onTabPress).toHaveBeenCalledWith('resultados');
  });

  it('renders with identificacion as active tab', () => {
    const { getByTestId } = render(
      <BottomNav activeTab="identificacion" onTabPress={() => {}} />
    );
    const activeTab = getByTestId('nav-tab-identificacion');
    expect(activeTab).toBeTruthy();
  });

  it('renders with estructura as active tab', () => {
    const { getByTestId } = render(
      <BottomNav activeTab="estructura" onTabPress={() => {}} />
    );
    const activeTab = getByTestId('nav-tab-estructura');
    expect(activeTab).toBeTruthy();
  });
});
