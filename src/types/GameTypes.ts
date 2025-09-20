// Game state enumeration
export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  GAME_OVER = 'game_over',
  PAUSED = 'paused',
}

// Input types
export type InputType = 'flap' | 'pause';

// Rectangle interface for collision detection
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Cloud interface for enhanced cloud rendering
export interface Cloud {
  x: number; // Horizontal position
  y: number; // Vertical position
  width: number; // Base width
  height: number; // Base height
  opacity: number; // Alpha transparency (0-1)
  speed: number; // Horizontal movement speed
  scale: number; // Size multiplier for variety
}

// Game entity base interface
export interface GameEntity {
  x: number;
  y: number;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
}

// Game configuration interface
export interface GameConfig {
  readonly CANVAS_WIDTH: number;
  readonly CANVAS_HEIGHT: number;
  readonly GRAVITY: number;
  readonly FLAP_STRENGTH: number;
  readonly PIPE_SPEED: number;
  readonly PIPE_GAP: number;
  readonly PIPE_SPAWN_INTERVAL: number;
  readonly PIGEON_SIZE: number;
  readonly PIPE_WIDTH: number;
}
