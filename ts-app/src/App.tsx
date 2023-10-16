import React from 'react';
import './App.scss';
import { Provider } from "mobx-react";
import { store } from "./store";
import Chatbot from "./components/chatbot/Chatbot";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';
import { ResumeCV } from './components/resume/ResumeCV';
import { Hobbies } from './components/hobbies/Hobbies';

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
    <Provider ApplicationStore={store}>
      <div className="App">
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <TopBar/>
          <Routes>
            <Route path="/" element={<AboutMe />} />
            <Route path="/resume" element={<ResumeCV />} />
            <Route path="/hobbies" element={<Hobbies />} />
          </Routes>
          <Chatbot
            closeChatwindow={() => console.log("Should have been closed")}
            isOpen={true}
            ApplicationStore={store}
          />
        </Router>
      </ThemeProvider>
      </div>
    </Provider>
  );
}

export default App;
