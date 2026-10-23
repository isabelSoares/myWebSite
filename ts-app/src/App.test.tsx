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

test('routes the AI photographer assistant invitation to the embedded Projects experience', () => {
    renderWithRouter();

    const assistantLink = screen.getByRole('link', { name: /AI Photographer Assistant/i });
    expect(assistantLink).toHaveAttribute('href', '/projects');
    expect(assistantLink).not.toHaveAttribute('target', '_blank');
    expect(assistantLink).toHaveAttribute('data-analytics-event', 'ai_assistant_link_click');

    userEvent.click(assistantLink);
    expect(screen.getByRole('heading', { name: 'AI Photographer Assistant' })).toBeInTheDocument();
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

test.each([
    ['/resume', 'A career in progress.'],
    ['/projects', 'Things I build outside work.'],
    ['/hobbies', 'Things I do when I am not at my keyboard.'],
])('loads %s directly', (route, heading) => {
    renderWithRouter([route]);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
});

test('shows the not-found experience for an unknown route', () => {
    renderWithRouter(['/this-page-does-not-exist']);

    expect(screen.getByRole('heading', { name: 'This page is not in the album.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the homepage' })).toHaveAttribute('href', '/');
});

test('App still renders with BrowserRouter without crashing', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
});
