import React from 'react';
import './App.scss';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';
import { ResumeCV } from './components/resume/ResumeCV';
import { Hobbies } from './components/hobbies/Hobbies';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const siteTheme = createTheme({
  palette: {
    background: {
      default: '#f4f0e8',
      paper: '#fffdf8'
    },
    primary: {
      main: '#d96c4b',
    },
    secondary: {
      main: '#155e63',
    }
  },
});

function App() {

  return (
    <div className="App">
        <ThemeProvider theme={siteTheme}>
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
          <TopBar/>
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
