import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutMe } from './AboutMe';

test('uses the generated portrait instead of the original public file', () => {
  render(
    <MemoryRouter>
      <AboutMe />
    </MemoryRouter>,
  );

  const portrait = screen.getByAltText('Isabel Soares');
  expect(portrait).toHaveAttribute('src', expect.stringContaining('/photos/generated/featured/portrait-'));
  expect(portrait).toHaveAttribute('width', '1500');
  expect(portrait).toHaveAttribute('height', '2000');
  expect(portrait.style.aspectRatio || '').toBe('');
  expect(portrait.style.objectFit || '').toBe('');
  expect(portrait).not.toHaveAttribute('src', expect.stringContaining('IMG_7833'));
  expect(document.body.innerHTML).not.toContain('raw.githubusercontent.com');
});
