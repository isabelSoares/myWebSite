import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hobbies } from './Hobbies';

test('renders every album from the generated manifest without raw photo links', () => {
  render(<Hobbies />);

  for (const album of [
    'Portugal', 'UK', 'USA', 'Italy', 'Netherlands', 'Brazil', 'Canada',
    'Austria', 'Croatia', 'France', 'Switzerland', 'Malta', 'Spain', 'Republic Dominican',
  ]) {
    expect(screen.getByText(album)).toBeInTheDocument();
  }

  expect(screen.getByText(/Photographs © Isabel Soares/)).toBeInTheDocument();
  expect(document.body.innerHTML).not.toContain('raw.githubusercontent.com');
});
