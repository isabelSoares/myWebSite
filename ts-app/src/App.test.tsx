import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App, { AppContent } from './App';

window.scrollTo = jest.fn();

const renderWithRouter = (initialEntries = ['/']) =>
    render(
        <MemoryRouter initialEntries={initialEntries}>
            <AppContent />
        </MemoryRouter>
    );

test('renders the portfolio homepage and navigation', () => {
    renderWithRouter();

    expect(screen.getByText(/I'm an AI Engineer in Lisbon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hobbies' })).toBeInTheDocument();
});

test('navigates to the Projects page and shows the AI Photographer Assistant', () => {
    renderWithRouter();

    const projectsButton = screen.getByRole('button', { name: 'Projects' });
    userEvent.click(projectsButton);

    expect(screen.getByRole('heading', { name: 'Things I build outside work.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AI Photographer Assistant' })).toBeInTheDocument();
});

test('renders a safe external AI photographer assistant link', () => {
    renderWithRouter();

    const assistantLink = screen.getByRole('link', { name: /AI Photographer Assistant/i });
    expect(assistantLink).toHaveAttribute('href', 'https://ai-photographer-assistant.example.invalid');
    expect(assistantLink).toHaveAttribute('target', '_blank');
    expect(assistantLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(assistantLink).toHaveAttribute('data-analytics-event', 'ai_assistant_link_click');
});

test('does not render personal project cards on the homepage', () => {
    renderWithRouter();

    expect(screen.queryByRole('heading', { name: 'Things I build outside work.' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'CV Photo AI' })).not.toBeInTheDocument();
    expect(screen.queryAllByRole('link', { name: /View project/i })).toHaveLength(0);
});

test('Projects page links to both GitHub repositories', () => {
    renderWithRouter(['/projects']);

    const aiLink = screen.getByRole('link', { name: 'View project on GitHub' });
    expect(aiLink).toHaveAttribute('href', 'https://github.com/isabelSoares/ai-photographer-assistant');
    expect(aiLink).toHaveAttribute('target', '_blank');
    expect(aiLink).toHaveAttribute('rel', 'noopener noreferrer');

    const cvLink = screen.getByRole('link', { name: 'View project' });
    expect(cvLink).toHaveAttribute('href', 'https://github.com/isabelSoares/cv-detect-people-my-gallery');
    expect(cvLink).toHaveAttribute('target', '_blank');
    expect(cvLink).toHaveAttribute('rel', 'noopener noreferrer');
});

test('App still renders with BrowserRouter without crashing', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
});
