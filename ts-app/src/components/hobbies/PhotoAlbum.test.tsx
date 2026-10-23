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
    width: 540,
    height: 360,
    fullWidth: 1800,
    fullHeight: 1200,
  },
];

test('uses thumbnails, opens the full image, and preserves keyboard controls', async () => {
  render(<PhotoAlbum albumName="Portugal" dialogImages={images} />);

  const thumbnail = screen.getByAltText('Portugal photo 1');
  expect(thumbnail).toHaveAttribute('src', images[0].thumbnail);
  expect(thumbnail).toHaveAttribute('draggable', 'false');

  fireEvent.click(screen.getByRole('button', { name: 'Open Portugal photo 1' }));
  const dialog = await screen.findByRole('dialog');
  const fullImage = within(dialog).getByAltText('Portugal photo 1');
  expect(fullImage).toHaveAttribute('src', images[0].image);

  const contextMenu = createEvent.contextMenu(fullImage);
  fireEvent(fullImage, contextMenu);
  expect(contextMenu.defaultPrevented).toBe(true);

  fireEvent.click(within(dialog).getByRole('button', { name: 'Next' }));
  expect(within(dialog).getByAltText('Portugal photo 2')).toHaveAttribute('src', images[1].image);
  expect(within(dialog).getByRole('button', { name: 'Previous' })).toBeEnabled();
});
