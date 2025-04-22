
import React, { useEffect, useState } from 'react';
import { Player } from '../types/game';
import { createItemSprite } from '../utils/spriteUtils';

interface GameUIProps {
  player: Player;
}

const GameUI: React.FC<GameUIProps> = ({ player }) => {
  const { health, rupees } = player;
  const [heartSprite, setHeartSprite] = useState('');
  const [rupeeSprite, setRupeeSprite] = useState('');
  
  // Generate item sprites for UI
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHeartSprite(createItemSprite('heart'));
      setRupeeSprite(createItemSprite('rupee'));
    }
  }, []);
  
  return (
    <div className="zelda-ui">
      <div className="zelda-health">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={`heart-${index}`} 
            className="zelda-heart-ui"
            style={{
              opacity: index < health ? 1 : 0.3,
              backgroundImage: heartSprite ? `url(${heartSprite})` : 'none',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
      </div>
      
      <div className="zelda-rupee-count">
        <div 
          className="zelda-rupee-ui"
          style={{
            backgroundImage: rupeeSprite ? `url(${rupeeSprite})` : 'none',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <span className="text-xl font-bold">{rupees}</span>
      </div>
    </div>
  );
};

export default GameUI;
