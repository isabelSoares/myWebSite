import React from 'react';
import './App.scss';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';
import { ResumeCV } from './components/resume/ResumeCV';
import { Master } from './components/resume/education/Master';
import { Licenciate } from './components/resume/education/Licenciate';
import { Internship } from './components/resume/job/Internship';
import { Teaching } from './components/resume/job/Teaching';
import { EAI } from './components/resume/job/EAI';
import { FullStack } from './components/resume/job/FullStack';
import { Hobbies } from './components/hobbies/Hobbies';
import { Chatbot } from './components/chatbot/Chatbot';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    background: {
      default: '#0f1924',
      paper: '#9BCECA'
    },
    primary: {
      main: '#9BCECA',
    },
    secondary: {
      main: '#357B8D',
    }
  },
});

function App() {

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <TopBar/>
          <Routes>
            <Route path="/" element={<AboutMe />} />
            <Route path="/resume" element={<ResumeCV />} />
            <Route path="/resume/master" element={<Master />} />
            <Route path="/resume/licenciate" element={<Licenciate />} />
            <Route path="/resume/internship" element={<Internship />} />
            <Route path="/resume/teaching" element={<Teaching />} />
            <Route path="/resume/firstJob" element={<EAI />} />
            <Route path="/resume/fullStack" element={<FullStack />} />
            <Route path="/hobbies" element={<Hobbies />} />
          </Routes>
        </Router>
      </ThemeProvider>
      <Chatbot />
    </div>
  );
}

export default App;
