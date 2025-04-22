import React, { useState } from 'react';
import Game from '../components/Game';
import GameTitle from '../components/GameTitle';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleStartGame = () => {
    setGameStarted(true);
  };
  
  return (
    <div className="min-h-screen bg-black">
      {gameStarted ? (
        <Game />
      ) : (
        <GameTitle onStartGame={handleStartGame} />
      )}
    </div>
  );
};

export default Index;
