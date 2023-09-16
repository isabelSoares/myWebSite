import React from 'react';
import './App.scss';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    background: {
      default: '#0f1924',
    },
    primary: {
      main: '#4a9db0',
    },
    secondary: {
      main: '#e6db74',
    }
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <TopBar/>
        <AboutMe/>
      </ThemeProvider>
    </div>
  );
}

export default App;
