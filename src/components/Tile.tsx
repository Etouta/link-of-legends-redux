
import React, { useEffect, useState } from 'react';
import { Tile as TileType } from '../types/game';
import { createTileSprite } from '../utils/spriteUtils';

interface TileProps {
  tile: TileType;
  tileSize: number;
}

const Tile: React.FC<TileProps> = ({ tile, tileSize }) => {
  const { type, position } = tile;
  const [spriteUrl, setSpriteUrl] = useState('');
  
  // Generate sprite on component mount
  useEffect(() => {
    // Only create sprite on client side (not during SSR)
    if (typeof window !== 'undefined') {
      setSpriteUrl(createTileSprite(type));
    }
  }, [type]);
  
  return (
    <div 
      className="zelda-tile" 
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        left: `${position.x * tileSize}px`,
        top: `${position.y * tileSize}px`,
        backgroundImage: spriteUrl ? `url(${spriteUrl})` : 'none',
        backgroundSize: 'cover'
      }}
    />
  );
};

export default Tile;
