import React from 'react';
import { createEvent, fireEvent, render, screen, within } from '@testing-library/react';
import { PhotoAlbum } from './PhotoAlbum';

const images = [
  {
    description: 'Portugal photo 1',
    image: '/photos/generated/albums/portugal/one.webp',
    thumbnail: '/photos/generated/albums/portugal/one-thumb.webp',
    width: 540,
    height: 360,
    fullWidth: 1800,
    fullHeight: 1200,
  },
  {
    description: 'Portugal photo 2',
    image: '/photos/generated/albums/portugal/two.webp',
    thumbnail: '/photos/generated/albums/portugal/two-thumb.webp',
    width: 400,
    height: 600,
    fullWidth: 1333,
    fullHeight: 2000,
    rotation: 90,
  },
];

test('uses thumbnails, opens the full image, and preserves keyboard controls', async () => {
  render(<PhotoAlbum albumName="Portugal" dialogImages={images} />);

  const thumbnailButton = screen.getByRole('button', { name: 'Open Portugal photo 1' });
  const thumbnail = within(thumbnailButton).getByRole('img');
  expect(thumbnail).toHaveAttribute('src', images[0].thumbnail);
  expect(thumbnail).toHaveAttribute('alt', '');
  expect(thumbnail).toHaveAttribute('draggable', 'false');

  fireEvent.click(screen.getByRole('button', { name: 'Open Portugal photo 1' }));
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveAccessibleName('Portugal photo viewer');
  expect(within(dialog).getByRole('status')).toHaveTextContent('Photo 1 of 2: Portugal photo 1');
  const fullImage = within(dialog).getByAltText('Portugal photo 1');
  expect(fullImage).toHaveAttribute('src', images[0].image);
  expect(within(dialog).getByRole('button', { name: 'Previous' })).toBeDisabled();
  expect(within(dialog).getByRole('button', { name: 'Next' })).toBeEnabled();

  const contextMenu = createEvent.contextMenu(fullImage);
  fireEvent(fullImage, contextMenu);
  expect(contextMenu.defaultPrevented).toBe(true);

  fireEvent.click(within(dialog).getByRole('button', { name: 'Next' }));
  expect(within(dialog).getByAltText('Portugal photo 2')).toHaveAttribute('src', images[1].image);
  expect(within(dialog).getByRole('status')).toHaveTextContent('Photo 2 of 2: Portugal photo 2');
  expect(within(dialog).getByRole('button', { name: 'Previous' })).toBeEnabled();
  expect(within(dialog).getByRole('button', { name: 'Next' })).toBeDisabled();
});

test('applies the quarter-turn orientation to the strip and the dialog', async () => {
  render(<PhotoAlbum albumName="Portugal" dialogImages={images} />);

  const rotatedThumbnail = within(screen.getByRole('button', { name: 'Open Portugal photo 2' })).getByRole('img');
  expect(rotatedThumbnail).toHaveClass('rotation-90');
  expect(rotatedThumbnail).toHaveClass('is-quarter-turn');

  fireEvent.click(screen.getByRole('button', { name: 'Open Portugal photo 2' }));
  const dialog = await screen.findByRole('dialog');
  const fullImage = within(dialog).getByAltText('Portugal photo 2');
  expect(fullImage).toHaveClass('rotation-90');
  expect(fullImage).toHaveClass('is-quarter-turn');
});
