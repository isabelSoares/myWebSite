import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio homepage and navigation', () => {
  render(<App />);

  expect(screen.getByText(/I'm an AI Engineer in Lisbon/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Experience' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Off the clock' })).toBeInTheDocument();
});

test('renders a safe external AI photographer assistant link', () => {
  render(<App />);

  const assistantLink = screen.getByRole('link', { name: /AI Photographer Assistant/i });
  expect(assistantLink).toHaveAttribute('href', 'https://ai-photographer-assistant.example.invalid');
  expect(assistantLink).toHaveAttribute('target', '_blank');
  expect(assistantLink).toHaveAttribute('rel', 'noopener noreferrer');
  expect(assistantLink).toHaveAttribute('data-analytics-event', 'ai_assistant_link_click');
});

test('renders the personal projects section with both project links', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Things I build outside work.' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'AI Photographer Assistant' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'CV Photo AI' })).toBeInTheDocument();
  const projectLinks = screen.getAllByRole('link', { name: /View project/i });
  expect(projectLinks).toHaveLength(2);
  expect(projectLinks[0]).toHaveAttribute('href', 'https://github.com/isabelSoares/ai-photographer-assistant');
  expect(projectLinks[1]).toHaveAttribute('href', 'https://github.com/isabelSoares/cv-detect-people-my-gallery');
});
