import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders playlist textarea and Go button', () => {
  const { getByText, getByRole } = render(<App />);
  const textarea = getByRole('textbox');
  expect(textarea).toBeInTheDocument();
  const goButton = getByText(/Go!/i);
  expect(goButton).toBeInTheDocument();
});
