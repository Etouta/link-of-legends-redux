
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Direction } from '../types/game';
import { 
  initializeGame, 
  movePlayer, 
  moveEnemies, 
  checkAttacks,
  checkItemCollection,
  checkPlayerDamage
} from '../utils/gameUtils';
import Tile from './Tile';
import Player from './Player';
import Enemy from './Enemy';
import Item from './Item';
import GameUI from './GameUI';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [tileSize, setTileSize] = useState(32);
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  
  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    // Update game at 60 FPS
    if (timestamp - lastUpdateRef.current >= 1000 / 60) {
      lastUpdateRef.current = timestamp;
      
      setGameState(prevState => {
        // Create new state to work with
        let newState = { ...prevState };
        
        // Process player movement based on keys pressed
        keysPressed.current.forEach(key => {
          switch (key) {
            case 'ArrowUp':
            case 'w':
              newState = { 
                ...newState, 
                player: movePlayer(newState.player, 'up', newState.map) 
              };
              break;
            case 'ArrowDown':
            case 's':
              newState = { 
                ...newState, 
                player: movePlayer(newState.player, 'down', newState.map) 
              };
              break;
            case 'ArrowLeft':
            case 'a':
              newState = { 
                ...newState, 
                player: movePlayer(newState.player, 'left', newState.map) 
              };
              break;
            case 'ArrowRight':
            case 'd':
              newState = { 
                ...newState, 
                player: movePlayer(newState.player, 'right', newState.map) 
              };
              break;
            case ' ':
              // Attack if not already attacking and attack cooldown is over
              if (!newState.player.attacking && newState.player.attackCooldown <= 0) {
                newState = { 
                  ...newState, 
                  player: { 
                    ...newState.player, 
                    attacking: true, 
                    attackCooldown: 20 
                  } 
                };
              }
              break;
          }
        });
        
        // Process attack state
        if (newState.player.attacking) {
          // Process enemy damage from attacks
          newState = {
            ...newState,
            enemies: checkAttacks(newState.player, newState.enemies)
          };
          
          // Attack animation lasts 10 frames
          if (newState.player.attackCooldown <= 10) {
            newState = {
              ...newState,
              player: {
                ...newState.player,
                attacking: false
              }
            };
          }
        }
        
        // Decrease attack cooldown
        if (newState.player.attackCooldown > 0) {
          newState = {
            ...newState,
            player: {
              ...newState.player,
              attackCooldown: newState.player.attackCooldown - 1
            }
          };
        }
        
        // Process enemy movement
        newState = {
          ...newState,
          enemies: moveEnemies(newState.enemies, newState.player, newState.map)
        };
        
        // Process item collection
        const [updatedPlayer, updatedItems] = checkItemCollection(
          newState.player, 
          newState.items
        );
        
        newState = {
          ...newState,
          player: updatedPlayer,
          items: updatedItems
        };
        
        // Process player damage from enemies
        newState = {
          ...newState,
          player: checkPlayerDamage(newState.player, newState.enemies)
        };
        
        // Filter out dead enemies
        newState = {
          ...newState,
          enemies: newState.enemies.filter(enemy => enemy.health > 0)
        };
        
        // Check for game over
        if (newState.player.health <= 0) {
          alert('Game Over! Refresh to try again.');
          // Reset game
          return initializeGame();
        }
        
        // Check for game win (all enemies defeated)
        if (newState.enemies.length === 0) {
          alert(`You won! You collected ${newState.player.rupees} rupees.`);
          // Reset game
          return initializeGame();
        }
        
        return newState;
      });
    }
    
    frameRef.current = requestAnimationFrame(gameLoop);
  }, []);
  
  // Set up game and cleanup on unmount
  useEffect(() => {
    // Start game loop
    frameRef.current = requestAnimationFrame(gameLoop);
    
    // Key press event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Resize event listener
    const handleResize = () => {
      if (gameRef.current) {
        const gameWidth = gameRef.current.clientWidth;
        const gameHeight = gameRef.current.clientHeight;
        
        // Calculate tile size based on game container and map size
        const tileX = gameWidth / gameState.map.width;
        const tileY = gameHeight / gameState.map.height;
        
        // Use the smaller of the two to ensure map fits
        setTileSize(Math.floor(Math.min(tileX, tileY)));
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Calculate initial tile size
    handleResize();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameLoop, gameState.map.width, gameState.map.height]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">Legend of Zelda</h1>
      <p className="text-white mb-4">
        Use arrow keys or WASD to move. Press spacebar to attack.
      </p>
      
      <div 
        ref={gameRef}
        className="zelda-game border-4 border-yellow-600 bg-green-800 relative overflow-hidden"
      >
        {/* Map */}
        <div 
          className="zelda-game-map"
          style={{
            width: `${gameState.map.width * tileSize}px`,
            height: `${gameState.map.height * tileSize}px`
          }}
        >
          {/* Render tiles */}
          {gameState.map.tiles.map((tile, index) => (
            <Tile key={`tile-${index}`} tile={tile} tileSize={tileSize} />
          ))}
          
          {/* Render items */}
          {gameState.items.map(item => (
            <Item key={item.id} item={item} tileSize={tileSize} />
          ))}
          
          {/* Render enemies */}
          {gameState.enemies.map(enemy => (
            <Enemy key={enemy.id} enemy={enemy} tileSize={tileSize} />
          ))}
          
          {/* Render player */}
          <Player player={gameState.player} tileSize={tileSize} />
        </div>
        
        {/* UI */}
        <GameUI player={gameState.player} />
      </div>
    </div>
  );
};

export default Game;
