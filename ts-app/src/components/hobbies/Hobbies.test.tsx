import React from 'react';
import { render, screen } from '@testing-library/react';
import photoManifest from '../../data/photo-manifest.json';
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

  const hero = photoManifest.featured.hero;
  const heroImage = screen.getByAltText(hero.alt);
  expect(heroImage).toHaveAttribute('width', String(hero.full.width));
  expect(heroImage).toHaveAttribute('height', String(hero.full.height));
  expect(heroImage.style.aspectRatio || '').toBe('');
  expect(heroImage.style.objectFit || '').toBe('');
  expect(heroImage).toHaveAttribute('loading', 'lazy');
  expect(heroImage).toHaveAttribute('decoding', 'async');
});
