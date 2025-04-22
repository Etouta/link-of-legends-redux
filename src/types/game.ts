
export type Direction = 'up' | 'down' | 'left' | 'right';

export type Position = {
  x: number;
  y: number;
};

export type TileType = 'grass' | 'water' | 'tree' | 'sand' | 'mountain';

export type Tile = {
  type: TileType;
  position: Position;
  walkable: boolean;
};

export type Entity = {
  id: string;
  position: Position;
  health: number;
  direction: Direction;
};

export type Player = Entity & {
  rupees: number;
  attacking: boolean;
  attackCooldown: number;
};

export type Enemy = Entity & {
  movePattern: 'random' | 'follow';
  moveTimer: number;
};

export type Item = {
  id: string;
  type: 'heart' | 'rupee';
  position: Position;
  collected: boolean;
};

export type MapData = {
  tiles: Tile[];
  width: number;
  height: number;
};

export type GameState = {
  player: Player;
  enemies: Enemy[];
  items: Item[];
  map: MapData;
};
