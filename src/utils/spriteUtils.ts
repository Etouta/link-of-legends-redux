
import { Direction } from '../types/game';

// Create a simple player sprite as a data URL
export const createPlayerSprite = (direction: Direction): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = 32;
  canvas.height = 32;
  
  // Base color (green tunic)
  ctx.fillStyle = '#3a824a';
  
  // Draw body based on direction
  switch (direction) {
    case 'down':
      // Body
      ctx.fillRect(10, 14, 12, 12);
      // Head
      ctx.fillStyle = '#f5d7b5'; // Skin tone
      ctx.fillRect(10, 4, 12, 10);
      // Hair
      ctx.fillStyle = '#f0d848'; // Blonde
      ctx.fillRect(8, 2, 16, 4);
      break;
      
    case 'up':
      // Body
      ctx.fillRect(10, 14, 12, 12);
      // Head (back view)
      ctx.fillStyle = '#f0d848'; // Blonde hair
      ctx.fillRect(10, 4, 12, 10);
      break;
      
    case 'left':
      // Body
      ctx.fillRect(10, 14, 12, 12);
      // Head
      ctx.fillStyle = '#f5d7b5'; // Skin tone
      ctx.fillRect(10, 4, 8, 10);
      // Hair
      ctx.fillStyle = '#f0d848'; // Blonde
      ctx.fillRect(8, 2, 12, 4);
      break;
      
    case 'right':
      // Body
      ctx.fillRect(10, 14, 12, 12);
      // Head
      ctx.fillStyle = '#f5d7b5'; // Skin tone
      ctx.fillRect(14, 4, 8, 10);
      // Hair
      ctx.fillStyle = '#f0d848'; // Blonde
      ctx.fillRect(12, 2, 12, 4);
      break;
  }
  
  // Add shield (left arm for right facing)
  if (direction === 'right') {
    ctx.fillStyle = '#2d5098'; // Blue
    ctx.fillRect(6, 16, 4, 8);
  }
  
  // Add sword (right arm for left facing)
  if (direction === 'left') {
    ctx.fillStyle = '#cccccc'; // Silver
    ctx.fillRect(22, 16, 4, 8);
  }
  
  // Add legs
  ctx.fillStyle = '#78552b'; // Brown
  ctx.fillRect(10, 26, 5, 6);
  ctx.fillRect(17, 26, 5, 6);
  
  return canvas.toDataURL();
};

// Create a simple enemy sprite as a data URL
export const createEnemySprite = (type: 'octorok' | 'moblin' = 'octorok'): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = 32;
  canvas.height = 32;
  
  if (type === 'octorok') {
    // Base color (red body)
    ctx.fillStyle = '#c53030';
    
    // Body
    ctx.fillRect(8, 8, 16, 16);
    
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 12, 4, 4);
    ctx.fillRect(18, 12, 4, 4);
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 14, 2, 2);
    ctx.fillRect(20, 14, 2, 2);
    
    // Tentacles
    ctx.fillStyle = '#c53030';
    ctx.fillRect(6, 24, 4, 4);
    ctx.fillRect(22, 24, 4, 4);
    ctx.fillRect(12, 24, 4, 4);
    ctx.fillRect(16, 24, 4, 4);
  } else {
    // Moblin (pig-like enemy)
    
    // Body
    ctx.fillStyle = '#8f5430';
    ctx.fillRect(8, 12, 16, 14);
    
    // Head
    ctx.fillStyle = '#bf7a4a';
    ctx.fillRect(8, 4, 16, 8);
    
    // Snout
    ctx.fillRect(12, 12, 8, 4);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 6, 3, 3);
    ctx.fillRect(19, 6, 3, 3);
    
    // Weapon
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(24, 10, 2, 14);
  }
  
  return canvas.toDataURL();
};

// Create a simple item sprite as a data URL
export const createItemSprite = (type: 'heart' | 'rupee'): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = 32;
  canvas.height = 32;
  
  if (type === 'heart') {
    ctx.fillStyle = '#e53e3e';
    
    // Create a heart shape
    ctx.beginPath();
    ctx.moveTo(16, 8);
    ctx.bezierCurveTo(16, 6, 14, 4, 10, 4);
    ctx.bezierCurveTo(4, 4, 4, 10, 4, 10);
    ctx.bezierCurveTo(4, 16, 10, 22, 16, 28);
    ctx.bezierCurveTo(22, 22, 28, 16, 28, 10);
    ctx.bezierCurveTo(28, 10, 28, 4, 22, 4);
    ctx.bezierCurveTo(18, 4, 16, 6, 16, 8);
    ctx.fill();
  } else {
    // Rupee
    ctx.fillStyle = '#4ade80';
    
    // Create a diamond shape
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(28, 16);
    ctx.lineTo(16, 28);
    ctx.lineTo(4, 16);
    ctx.closePath();
    ctx.fill();
    
    // Add shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(16, 8);
    ctx.lineTo(20, 16);
    ctx.lineTo(16, 24);
    ctx.lineTo(12, 16);
    ctx.closePath();
    ctx.fill();
  }
  
  return canvas.toDataURL();
};

// Create a simple tile sprite as a data URL
export const createTileSprite = (type: 'grass' | 'water' | 'tree' | 'sand' | 'mountain'): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = 32;
  canvas.height = 32;
  
  switch (type) {
    case 'grass':
      // Base color
      ctx.fillStyle = '#2e8b57';
      ctx.fillRect(0, 0, 32, 32);
      
      // Add some texture
      ctx.fillStyle = '#3c9d67';
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * 32;
        const y = Math.random() * 32;
        ctx.fillRect(x, y, 2, 2);
      }
      break;
      
    case 'water':
      // Base color
      ctx.fillStyle = '#4a80bd';
      ctx.fillRect(0, 0, 32, 32);
      
      // Add waves
      ctx.fillStyle = '#5a90cd';
      ctx.fillRect(0, 4, 32, 2);
      ctx.fillRect(4, 12, 32, 2);
      ctx.fillRect(0, 20, 32, 2);
      ctx.fillRect(8, 28, 32, 2);
      break;
      
    case 'tree':
      // Trunk
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(12, 16, 8, 16);
      
      // Leaves
      ctx.fillStyle = '#265c42';
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(28, 20);
      ctx.lineTo(4, 20);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'sand':
      // Base color
      ctx.fillStyle = '#e6c588';
      ctx.fillRect(0, 0, 32, 32);
      
      // Add some texture
      ctx.fillStyle = '#d9b978';
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 32;
        const y = Math.random() * 32;
        ctx.fillRect(x, y, 2, 2);
      }
      break;
      
    case 'mountain':
      // Base color
      ctx.fillStyle = '#7a7a7a';
      
      // Mountain shape
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo(32, 32);
      ctx.lineTo(32, 24);
      ctx.lineTo(20, 8);
      ctx.lineTo(12, 16);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.fill();
      
      // Snow cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(16, 8);
      ctx.lineTo(24, 16);
      ctx.lineTo(8, 16);
      ctx.closePath();
      ctx.fill();
      break;
  }
  
  return canvas.toDataURL();
};
