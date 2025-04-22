
import React, { useState } from 'react';
import Game from '../components/Game';
import GameTitle from '../components/GameTitle';
import { LocaleProvider } from '../context/LocaleContext';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleStartGame = () => {
    setGameStarted(true);
  };
  
  return (
    <LocaleProvider>
      <div className="min-h-screen bg-black">
        {gameStarted ? (
          <Game />
        ) : (
          <GameTitle onStartGame={handleStartGame} />
        )}
      </div>
    </LocaleProvider>
  );
};

export default Index;

