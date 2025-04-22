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
import { useLocale } from "../context/LocaleContext";

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [tileSize, setTileSize] = useState(32);
  const [gameOver, setGameOver] = useState<null | "dead" | "win">(null);
  const [lastScore, setLastScore] = useState<number>(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const { t, lang, setLang } = useLocale();

  const gameLoop = useCallback((timestamp: number) => {
    if (gameOver) return;

    if (timestamp - lastUpdateRef.current >= 1000 / 60) {
      lastUpdateRef.current = timestamp;
      
      setGameState(prevState => {
        let newState = { ...prevState };
        
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
        
        if (newState.player.attacking) {
          newState = {
            ...newState,
            enemies: checkAttacks(newState.player, newState.enemies)
          };
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
        if (newState.player.attackCooldown > 0) {
          newState = {
            ...newState,
            player: {
              ...newState.player,
              attackCooldown: newState.player.attackCooldown - 1
            }
          };
        }
        newState = {
          ...newState,
          enemies: moveEnemies(newState.enemies, newState.player, newState.map)
        };
        const [updatedPlayer, updatedItems] = checkItemCollection(
          newState.player, 
          newState.items
        );
        newState = {
          ...newState,
          player: updatedPlayer,
          items: updatedItems
        };
        newState = {
          ...newState,
          player: checkPlayerDamage(newState.player, newState.enemies)
        };
        newState = {
          ...newState,
          enemies: newState.enemies.filter(enemy => enemy.health > 0)
        };
        if (newState.player.health <= 0) {
          setGameOver("dead");
          setLastScore(newState.player.rupees);
          return newState;
        }
        if (newState.enemies.length === 0) {
          setGameOver("win");
          setLastScore(newState.player.rupees);
          return newState;
        }
        return newState;
      });
    }
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    frameRef.current = requestAnimationFrame(gameLoop);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const handleResize = () => {
      if (gameRef.current) {
        const gameWidth = gameRef.current.clientWidth;
        const gameHeight = gameRef.current.clientHeight;
        const tileX = gameWidth / gameState.map.width;
        const tileY = gameHeight / gameState.map.height;
        setTileSize(Math.floor(Math.min(tileX, tileY)));
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameLoop, gameOver, gameState.map.width, gameState.map.height]);

  const handleRestart = () => {
    setGameState(initializeGame());
    setGameOver(null);
    setLastScore(0);
    keysPressed.current = new Set();
    lastUpdateRef.current = 0;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="flex w-full justify-end mb-2">
        <label htmlFor="lang" className="text-white mr-2">{t("language")}</label>
        <select
          id="lang"
          value={lang}
          onChange={e => setLang(e.target.value as "en" | "fr")}
          className="rounded bg-yellow-200 px-2 py-1 text-black"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-white">{t("title")}</h1>
      <p className="text-white mb-4">
        {t("instruction")}
      </p>
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50 animate-fade-in">
          <div className="bg-yellow-100 border-4 border-yellow-500 p-8 rounded-lg flex flex-col items-center">
            <span className="text-5xl mb-4">
              {gameOver === "dead" ? "💀" : "⭐"}
            </span>
            <h2 className="text-2xl font-bold mb-2 text-center text-yellow-900">
              {gameOver === "dead" ? t("youAreDead") : t("victory")}
            </h2>
            <div className="mb-2 text-lg text-yellow-800">
              {gameOver === "dead"
                ? t("rupeesDead", { score: lastScore })
                : t("rupeesWin", { score: lastScore })}
            </div>
            <button
              className="mt-4 px-6 py-2 rounded bg-yellow-600 text-white font-bold shadow hover:bg-yellow-700 transition hover-scale animate-fade-in"
              onClick={handleRestart}
              autoFocus
            >
              {t("restart")}
            </button>
          </div>
        </div>
      )}
      <div 
        ref={gameRef}
        className="zelda-game border-4 border-yellow-600 bg-green-800 relative overflow-hidden"
        style={{ filter: gameOver ? "blur(1px) grayscale(80%)" : "none" }}
      >
        <div 
          className="zelda-game-map"
          style={{
            width: `${gameState.map.width * tileSize}px`,
            height: `${gameState.map.height * tileSize}px`
          }}
        >
          {gameState.map.tiles.map((tile, index) => (
            <Tile key={`tile-${index}`} tile={tile} tileSize={tileSize} />
          ))}
          {gameState.items.map(item => (
            <Item key={item.id} item={item} tileSize={tileSize} />
          ))}
          {gameState.enemies.map(enemy => (
            <Enemy key={enemy.id} enemy={enemy} tileSize={tileSize} />
          ))}
          <Player player={gameState.player} tileSize={tileSize} />
        </div>
        <GameUI player={gameState.player} />
      </div>
    </div>
  );
};

export default Game;
