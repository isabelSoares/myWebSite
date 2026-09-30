import React, { useEffect, useState } from 'react';
import './App.scss';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';
import { ResumeCV } from './components/resume/ResumeCV';
import { Hobbies } from './components/hobbies/Hobbies';

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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark-mode') === 'true');

  useEffect(() => {
    localStorage.setItem('dark-mode', String(darkMode));
  }, [darkMode]);

  return (
    <div className={`App${darkMode ? ' dark-mode' : ''}`}>
        <ThemeProvider theme={createSiteTheme(darkMode)}>
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
          <ScrollToTop />
          <TopBar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((isDark) => !isDark)} />
          <Routes>
            <Route path="/" element={<AboutMe />} />
            <Route path="/resume" element={<ResumeCV />} />
            <Route path="/hobbies" element={<Hobbies />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
