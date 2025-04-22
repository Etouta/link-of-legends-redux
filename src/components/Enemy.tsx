
import React, { useEffect, useState } from 'react';
import { Enemy as EnemyType } from '../types/game';
import { createEnemySprite } from '../utils/spriteUtils';

interface EnemyProps {
  enemy: EnemyType;
  tileSize: number;
}

const Enemy: React.FC<EnemyProps> = ({ enemy, tileSize }) => {
  const { position, direction, health } = enemy;
  const [spriteUrl, setSpriteUrl] = useState('');
  
  if (health <= 0) return null;
  
  // Generate sprite on first render
  useEffect(() => {
    // Only create sprite on client side (not during SSR)
    if (typeof window !== 'undefined') {
      // Randomly choose between enemy types
      const enemyType = Math.random() > 0.5 ? 'octorok' : 'moblin';
      setSpriteUrl(createEnemySprite(enemyType));
    }
  }, []);
  
  // Sprite rotation based on direction
  let rotation = 0;
  switch (direction) {
    case 'up': rotation = 0; break;
    case 'right': rotation = 90; break;
    case 'down': rotation = 180; break;
    case 'left': rotation = 270; break;
  }
  
  return (
    <div 
      className="zelda-enemy"
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        left: `${position.x * tileSize}px`,
        top: `${position.y * tileSize}px`,
      }}
    >
      <div 
        className="zelda-enemy-sprite" 
        style={{ 
          transform: `rotate(${rotation}deg)`,
          backgroundImage: spriteUrl ? `url(${spriteUrl})` : 'none',
          backgroundSize: 'contain'
        }}
      />
    </div>
  );
};

export default Enemy;
