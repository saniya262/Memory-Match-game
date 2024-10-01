import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <div className="App">
     
      <GameBoard />
    </div>
  );
};

export default App;

