import React from 'react';
import { render } from '@testing-library/react';

test('renders correctly', () => {
  const h2 = document.createElement('h2');
  const {getByText} = render(
    <h2>Yet another ToDo app</h2>
  )
  expect(getByText('Yet another ToDo app')).toBeTruthy()
});
