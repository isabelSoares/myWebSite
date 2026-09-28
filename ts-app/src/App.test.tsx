import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio homepage and navigation', () => {
  render(<App />);

  expect(screen.getByText(/I'm Isabel Soares/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Experience' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Off the clock' })).toBeInTheDocument();
});
