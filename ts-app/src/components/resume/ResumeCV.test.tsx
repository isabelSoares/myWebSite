import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResumeCV } from './ResumeCV';

test('offers the PDF CV for download', () => {
  render(<ResumeCV />);

  const cvLink = screen.getByRole('link', { name: /download cv/i });
  expect(cvLink.getAttribute('href')).toContain('/isabel-soares-cv.pdf');
  expect(cvLink).toHaveAttribute('download');
});
