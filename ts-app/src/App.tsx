import React, { useEffect, useRef, useState } from 'react';
import './App.scss';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';
import { ResumeCV } from './components/resume/ResumeCV';
import { Hobbies } from './components/hobbies/Hobbies';
import { PersonalProjects } from './components/personal-projects/PersonalProjects';
import { NotFound } from './components/not-found/NotFound';
import { applyAppearance, readAppearance, writeAppearance } from './theme/appearance';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const createSiteTheme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    background: {
      default: darkMode ? '#17262b' : '#f4f0e8',
      paper: darkMode ? '#20383d' : '#fffdf8'
    },
    primary: {
      main: darkMode ? '#f2c94c' : '#243b53',
    },
    secondary: {
      main: '#155e63',
    }
  },
});

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Isabel Soares | AI Engineer',
  '/resume': 'Experience | Isabel Soares',
  '/projects': 'Projects | Isabel Soares',
  '/hobbies': 'Hobbies | Isabel Soares',
};

const NOT_FOUND_TITLE = 'Page not found | Isabel Soares';

const getRouteTitle = (pathname: string) => ROUTE_TITLES[pathname] ?? NOT_FOUND_TITLE;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

export const AppContent = () => {
  const [darkMode, setDarkMode] = useState(() => readAppearance() === 'dark');
  const { pathname } = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = useState(() => getRouteTitle(pathname));
  const isFirstRender = useRef(true);

  useEffect(() => {
    applyAppearance(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const title = getRouteTitle(pathname);
    document.title = title;
    setRouteAnnouncement(title);

    if (!isFirstRender.current) {
      document.getElementById('main-content')?.focus();
    }
    isFirstRender.current = false;
  }, [pathname]);

  const handleToggleDarkMode = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    writeAppearance(nextDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`App${darkMode ? ' dark-mode' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="visually-hidden" role="status" aria-live="polite">
        {routeAnnouncement}
      </div>
      <ThemeProvider theme={createSiteTheme(darkMode)}>
        <CssBaseline />
        <ScrollToTop />
        <TopBar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
        <Routes>
          <Route path="/" element={<AboutMe />} />
          <Route path="/resume" element={<ResumeCV />} />
          <Route path="/projects" element={<PersonalProjects />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AppContent />
    </Router>
  );
}

export default App;
