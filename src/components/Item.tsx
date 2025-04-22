
import React, { useEffect, useState } from 'react';
import { Item as ItemType } from '../types/game';
import { createItemSprite } from '../utils/spriteUtils';

interface ItemProps {
  item: ItemType;
  tileSize: number;
}

const Item: React.FC<ItemProps> = ({ item, tileSize }) => {
  const { position, type, collected } = item;
  const [spriteUrl, setSpriteUrl] = useState('');
  
  if (collected) return null;
  
  useEffect(() => {
    // Only create sprite on client side (not during SSR)
    if (typeof window !== 'undefined') {
      setSpriteUrl(createItemSprite(type));
    }
  }, [type]);
  
  return (
    <div 
      className="zelda-item"
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        left: `${position.x * tileSize}px`,
        top: `${position.y * tileSize}px`,
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundImage: spriteUrl ? `url(${spriteUrl})` : 'none',
          backgroundSize: 'contain'
        }}
      />
    </div>
  );
};

export default Item;
