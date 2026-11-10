import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import { AppContent } from './App';

beforeEach(() => {
  window.scrollTo = jest.fn();
  document.documentElement.lang = 'en';
  window.localStorage.clear();
  document.documentElement.classList.remove('dark-mode');
});

test.each([
  ['/','dark'],
  ['/resume','dark'],
  ['/projects','dark'],
  ['/hobbies','dark'],
  ['/unknown-route','dark'],
  ['/','light'],
  ['/resume','light'],
  ['/projects','light'],
  ['/hobbies','light'],
  ['/unknown-route','light'],
])('has no axe violations on %s in %s mode', async (route, mode) => {
  window.localStorage.setItem('dark-mode', mode === 'light' ? 'false' : 'true');
  const { container } = render(
    <MemoryRouter initialEntries={[route]}>
      <AppContent />
    </MemoryRouter>,
  );

  const results = await axe.run(container, {
    rules: {
      // Contrast is covered by the project's CSS token validator.
      'color-contrast': { enabled: false },
    },
  });

  expect(results.violations).toEqual([]);
});
