
import { Direction, Position, GameState, Player, Enemy, Item, Tile, MapData } from '../types/game';

// Check if two positions collide
export const checkCollision = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// Check if player can move to a position based on map tiles
export const canMoveTo = (position: Position, mapData: MapData): boolean => {
  const tile = mapData.tiles.find(
    (t) => t.position.x === position.x && t.position.y === position.y
  );
  
  if (!tile) return false;
  
  return tile.walkable;
};

// Get new position based on current position and direction
export const getNewPosition = (position: Position, direction: Direction): Position => {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
  }
};

// Check if position is within map bounds
export const isWithinBounds = (position: Position, mapData: MapData): boolean => {
  return (
    position.x >= 0 &&
    position.x < mapData.width &&
    position.y >= 0 &&
    position.y < mapData.height
  );
};

// Move player in a direction
export const movePlayer = (player: Player, direction: Direction, mapData: MapData): Player => {
  const newPlayer = { ...player, direction };
  
  if (player.attacking) return newPlayer;
  
  const newPosition = getNewPosition(player.position, direction);
  
  if (isWithinBounds(newPosition, mapData) && canMoveTo(newPosition, mapData)) {
    return { ...newPlayer, position: newPosition };
  }
  
  return newPlayer;
};

// Move enemies based on their pattern
export const moveEnemies = (enemies: Enemy[], player: Player, mapData: MapData): Enemy[] => {
  return enemies.map(enemy => {
    // Skip if enemy is not ready to move
    if (enemy.moveTimer > 0) {
      return { ...enemy, moveTimer: enemy.moveTimer - 1 };
    }
    
    // Set new movement timer
    const newEnemy = { ...enemy, moveTimer: 20 };
    
    if (enemy.movePattern === 'random') {
      // Random movement logic
      const directions: Direction[] = ['up', 'down', 'left', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      const newPosition = getNewPosition(enemy.position, randomDirection);
      
      if (isWithinBounds(newPosition, mapData) && canMoveTo(newPosition, mapData)) {
        return { ...newEnemy, position: newPosition, direction: randomDirection };
      }
      
      return newEnemy;
    } else {
      // Follow player logic
      const xDiff = player.position.x - enemy.position.x;
      const yDiff = player.position.y - enemy.position.y;
      
      let direction: Direction;
      
      // Decide which direction to move based on player position
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        direction = xDiff > 0 ? 'right' : 'left';
      } else {
        direction = yDiff > 0 ? 'down' : 'up';
      }
      
      const newPosition = getNewPosition(enemy.position, direction);
      
      if (isWithinBounds(newPosition, mapData) && canMoveTo(newPosition, mapData)) {
        return { ...newEnemy, position: newPosition, direction };
      }
      
      return newEnemy;
    }
  });
};

// Check if player is attacking enemies
export const checkAttacks = (player: Player, enemies: Enemy[]): Enemy[] => {
  if (!player.attacking) return enemies;
  
  // Calculate attack position based on player direction
  const attackPosition = getNewPosition(player.position, player.direction);
  
  return enemies.map(enemy => {
    if (checkCollision(attackPosition, enemy.position)) {
      return { ...enemy, health: enemy.health - 1 };
    }
    return enemy;
  });
};

// Check if player collects items
export const checkItemCollection = (player: Player, items: Item[]): [Player, Item[]] => {
  let updatedPlayer = { ...player };
  
  const updatedItems = items.map(item => {
    if (!item.collected && checkCollision(player.position, item.position)) {
      // Apply item effects
      if (item.type === 'heart') {
        updatedPlayer = { ...updatedPlayer, health: Math.min(updatedPlayer.health + 1, 5) };
      } else if (item.type === 'rupee') {
        updatedPlayer = { ...updatedPlayer, rupees: updatedPlayer.rupees + 1 };
      }
      
      return { ...item, collected: true };
    }
    return item;
  });
  
  return [updatedPlayer, updatedItems];
};

// Check if enemies damage player
export const checkPlayerDamage = (player: Player, enemies: Enemy[]): Player => {
  if (player.attacking) return player;
  
  const isHit = enemies.some(enemy => 
    enemy.health > 0 && checkCollision(player.position, enemy.position)
  );
  
  if (isHit) {
    return { ...player, health: player.health - 1 };
  }
  
  return player;
};

// Generate a random map
export const generateMap = (width: number, height: number): MapData => {
  const tiles: Tile[] = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let type: 'grass' | 'water' | 'tree' | 'sand' | 'mountain';
      let walkable = true;
      
      // Edge of map is water
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        type = 'water';
        walkable = false;
      } else {
        // Random terrain generation
        const random = Math.random();
        
        if (random < 0.7) {
          type = 'grass';
        } else if (random < 0.8) {
          type = 'tree';
          walkable = false;
        } else if (random < 0.85) {
          type = 'sand';
        } else if (random < 0.95) {
          type = 'water';
          walkable = false;
        } else {
          type = 'mountain';
          walkable = false;
        }
      }
      
      tiles.push({
        type,
        position: { x, y },
        walkable
      });
    }
  }
  
  return {
    tiles,
    width,
    height
  };
};

// Place the player in a valid starting position
export const placePlayer = (mapData: MapData): Position => {
  // Find a walkable tile near the center
  const centerX = Math.floor(mapData.width / 2);
  const centerY = Math.floor(mapData.height / 2);
  
  // Look in a spiral pattern from the center
  for (let layer = 0; layer < Math.max(mapData.width, mapData.height); layer++) {
    for (let x = centerX - layer; x <= centerX + layer; x++) {
      for (let y = centerY - layer; y <= centerY + layer; y++) {
        // Skip positions not on the current layer
        if (x > centerX - layer && x < centerX + layer && y > centerY - layer && y < centerY + layer) {
          continue;
        }
        
        const position = { x, y };
        if (isWithinBounds(position, mapData) && canMoveTo(position, mapData)) {
          return position;
        }
      }
    }
  }
  
  // Fallback to center (should never happen with our map generation)
  return { x: centerX, y: centerY };
};

// Generate enemies in valid positions
export const generateEnemies = (mapData: MapData, playerPosition: Position, count: number): Enemy[] => {
  const enemies: Enemy[] = [];
  
  for (let i = 0; i < count; i++) {
    let position: Position;
    let attempts = 0;
    
    // Find a valid position for an enemy
    do {
      const x = Math.floor(Math.random() * mapData.width);
      const y = Math.floor(Math.random() * mapData.height);
      position = { x, y };
      attempts++;
      
      // Prevent infinite loop
      if (attempts > 100) break;
      
      // Make sure enemy is not on player and is on a walkable tile
    } while (
      (position.x === playerPosition.x && position.y === playerPosition.y) ||
      !canMoveTo(position, mapData)
    );
    
    // Skip if we couldn't find a valid position
    if (attempts > 100) continue;
    
    // Create the enemy
    enemies.push({
      id: `enemy-${i}`,
      position,
      health: 1,
      direction: 'down',
      movePattern: Math.random() > 0.5 ? 'random' : 'follow',
      moveTimer: Math.floor(Math.random() * 20)
    });
  }
  
  return enemies;
};

// Generate items in valid positions
export const generateItems = (mapData: MapData, playerPosition: Position, enemyPositions: Position[], count: number): Item[] => {
  const items: Item[] = [];
  
  for (let i = 0; i < count; i++) {
    let position: Position;
    let attempts = 0;
    
    // Find a valid position for an item
    do {
      const x = Math.floor(Math.random() * mapData.width);
      const y = Math.floor(Math.random() * mapData.height);
      position = { x, y };
      attempts++;
      
      // Prevent infinite loop
      if (attempts > 100) break;
      
      // Make sure item is not on player or an enemy and is on a walkable tile
    } while (
      (position.x === playerPosition.x && position.y === playerPosition.y) ||
      enemyPositions.some(pos => pos.x === position.x && pos.y === position.y) ||
      !canMoveTo(position, mapData)
    );
    
    // Skip if we couldn't find a valid position
    if (attempts > 100) continue;
    
    // Create the item (70% chance of rupee, 30% chance of heart)
    items.push({
      id: `item-${i}`,
      position,
      type: Math.random() < 0.7 ? 'rupee' : 'heart',
      collected: false
    });
  }
  
  return items;
};

// Initialize a new game state
export const initializeGame = (): GameState => {
  const map = generateMap(20, 15);
  const playerPosition = placePlayer(map);
  
  const player: Player = {
    id: 'player',
    position: playerPosition,
    health: 3,
    direction: 'down',
    rupees: 0,
    attacking: false,
    attackCooldown: 0
  };
  
  const enemies = generateEnemies(map, playerPosition, 5);
  const enemyPositions = enemies.map(enemy => enemy.position);
  
  const items = generateItems(map, playerPosition, enemyPositions, 10);
  
  return {
    player,
    enemies,
    items,
    map
  };
};
