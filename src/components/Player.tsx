
import React, { useEffect, useState } from 'react';
import { Player as PlayerType } from '../types/game';
import { createPlayerSprite } from '../utils/spriteUtils';

interface PlayerProps {
  player: PlayerType;
  tileSize: number;
}

const Player: React.FC<PlayerProps> = ({ player, tileSize }) => {
  const { position, direction, attacking } = player;
  const [spriteUrl, setSpriteUrl] = useState('');
  
  // Update sprite when direction changes
  useEffect(() => {
    // Only create sprite on client side (not during SSR)
    if (typeof window !== 'undefined') {
      setSpriteUrl(createPlayerSprite(direction));
    }
  }, [direction]);
  
  return (
    <div 
      className="zelda-player"
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        left: `${position.x * tileSize}px`,
        top: `${position.y * tileSize}px`,
      }}
    >
      <div 
        className="zelda-player-sprite" 
        style={{ 
          backgroundImage: spriteUrl ? `url(${spriteUrl})` : 'none',
          backgroundSize: 'contain'
        }}
      />
      
      {/* Render sword when attacking */}
      {attacking && (
        <div 
          className="zelda-sword"
          style={{
            left: direction === 'right' ? '100%' : direction === 'left' ? '-50%' : '25%',
            top: direction === 'down' ? '100%' : direction === 'up' ? '-100%' : '0',
          }}
        />
      )}
    </div>
  );
};

export default Player;
