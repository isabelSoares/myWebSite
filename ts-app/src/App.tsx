import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TopBar } from './components/top-bar/TopBar';
import { AboutMe } from './components/about-me/AboutMe';

function App() {
  return (
    <div className="App">
      <TopBar/>
      <AboutMe/>
    </div>
  );
}

export default App;
