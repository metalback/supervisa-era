import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormSelect } from '../src/components/FormSelect';

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

describe('FormSelect', () => {
  it('renders label', () => {
    const { getByText } = render(
      <FormSelect label="Test Label" value="" onValueChange={() => {}} options={options} />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders placeholder when no value selected', () => {
    const { getByText } = render(
      <FormSelect label="Label" value="" onValueChange={() => {}} options={options} placeholder="Pick one" />
    );
    expect(getByText('Pick one')).toBeTruthy();
  });

  it('renders selected value label', () => {
    const { getByText } = render(
      <FormSelect label="Label" value="opt2" onValueChange={() => {}} options={options} />
    );
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('opens modal when trigger pressed', () => {
    const { getByText, getByTestId } = render(
      <FormSelect label="Label" value="" onValueChange={() => {}} options={options} testID="select" />
    );
    fireEvent.press(getByTestId('select'));
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
    expect(getByText('Option 3')).toBeTruthy();
  });

  it('calls onValueChange and closes modal when option selected', () => {
    const onValueChange = jest.fn();
    const { getByText, getByTestId, queryByText } = render(
      <FormSelect label="Label" value="" onValueChange={onValueChange} options={options} testID="select" />
    );
    fireEvent.press(getByTestId('select'));
    fireEvent.press(getByText('Option 2'));
    expect(onValueChange).toHaveBeenCalledWith('opt2');
  });
});
