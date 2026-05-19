import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../src/components/FormInput';

describe('FormInput', () => {
  it('renders label', () => {
    const { getByText } = render(
      <FormInput label="Test Label" value="" onChangeText={() => {}} />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders placeholder', () => {
    const { getByPlaceholderText } = render(
      <FormInput label="Label" value="" onChangeText={() => {}} placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <FormInput label="Label" value="" onChangeText={onChangeText} testID="input" />
    );
    fireEvent.changeText(getByTestId('input'), 'new value');
    expect(onChangeText).toHaveBeenCalledWith('new value');
  });

  it('renders with value', () => {
    const { getByDisplayValue } = render(
      <FormInput label="Label" value="test value" onChangeText={() => {}} />
    );
    expect(getByDisplayValue('test value')).toBeTruthy();
  });

  it('renders helper text', () => {
    const { getByText } = render(
      <FormInput label="Label" value="" onChangeText={() => {}} helperText="Help text" />
    );
    expect(getByText('Help text')).toBeTruthy();
  });

  it('renders suffix', () => {
    const { getByText } = render(
      <FormInput label="Label" value="10" onChangeText={() => {}} suffix="hrs" />
    );
    expect(getByText('hrs')).toBeTruthy();
  });

  it('renders as disabled when editable is false', () => {
    const { getByTestId } = render(
      <FormInput label="Label" value="readonly" onChangeText={() => {}} editable={false} testID="input" />
    );
    const input = getByTestId('input');
    expect(input.props.editable).toBe(false);
  });
});
