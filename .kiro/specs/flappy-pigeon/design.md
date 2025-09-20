# Flappy Pigeon Game Design

## Overview

Flappy Pigeon is a browser-based 2D game built with HTML5 Canvas and TypeScript. The architecture follows a component-based design with clear separation of concerns between game logic, rendering, input handling, and audio management. The game uses a simple game loop pattern with entity-component structure for maintainable and extensible code.

## Architecture

### Technology Stack

- **HTML5 Canvas**: For 2D rendering and game display
- **TypeScript**: For type-safe game logic and better development experience
- **Web Audio API**: For sound effects and audio management
- **CSS3**: For basic styling and responsive layout
- **No external libraries**: Keeping it simple with vanilla web technologies

### Core Architecture Pattern

The game follows a classic game loop architecture with these main phases:

1. **Input Processing**: Handle user input (clicks, keyboard)
2. **Update**: Update game state, physics, and entity positions
3. **Render**: Draw all game elements to the canvas
4. **Audio**: Trigger sound effects based on game events

## Components and Interfaces

### Game Engine Core

#### GameEngine Class

```typescript
interface GameEngine {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  gameState: GameState;
  lastFrameTime: number;

  start(): void;
  update(deltaTime: number): void;
  render(): void;
  handleInput(event: InputEvent): void;
}
```

#### GameState Enum

```typescript
enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  GAME_OVER = 'game_over',
  PAUSED = 'paused',
}
```

### Game Entities

#### Pigeon Class

```typescript
interface Pigeon {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  isFlapping: boolean;

  flap(): void;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
  getBounds(): Rectangle;
}
```

#### Pipe Class

```typescript
interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  gapSize: number;
  passed: boolean;

  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
  getBounds(): Rectangle[];
  isOffScreen(): boolean;
}
```

#### PipeManager Class

```typescript
interface PipeManager {
  pipes: Pipe[];
  spawnTimer: number;
  spawnInterval: number;

  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
  reset(): void;
  checkCollisions(pigeon: Pigeon): boolean;
  checkScoring(pigeon: Pigeon): number;
}
```

### Systems

#### InputManager Class

```typescript
interface InputManager {
  isFlapping: boolean;

  initialize(canvas: HTMLCanvasElement): void;
  handleClick(event: MouseEvent): void;
  handleKeyPress(event: KeyboardEvent): void;
  reset(): void;
}
```

#### AudioManager Class

```typescript
interface AudioManager {
  sounds: Map<string, HTMLAudioElement>;
  isMuted: boolean;

  loadSounds(): Promise<void>;
  playSound(soundName: string): void;
  toggleMute(): void;
}
```

#### ScoreManager Class

```typescript
interface ScoreManager {
  currentScore: number;
  highScore: number;

  addScore(points: number): void;
  reset(): void;
  saveHighScore(): void;
  loadHighScore(): number;
}
```

#### Renderer Class

```typescript
interface Renderer {
  context: CanvasRenderingContext2D;

  clear(): void;
  renderBackground(): void;
  renderUI(score: number, gameState: GameState): void;
  renderGameOver(finalScore: number, highScore: number): void;
  renderStartScreen(): void;
}
```

## Data Models

### Core Game Constants

```typescript
const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRAVITY: 0.5,
  FLAP_STRENGTH: -8,
  PIPE_SPEED: 2,
  PIPE_GAP: 150,
  PIPE_SPAWN_INTERVAL: 2000, // milliseconds
  PIGEON_SIZE: 40,
  PIPE_WIDTH: 60,
};
```

### Collision Detection

```typescript
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CollisionDetector {
  checkRectangleCollision(rect1: Rectangle, rect2: Rectangle): boolean;
  checkBoundaryCollision(entity: Rectangle, bounds: Rectangle): boolean;
}
```

### Game Physics

```typescript
interface Physics {
  applyGravity(entity: Pigeon, deltaTime: number): void;
  updatePosition(entity: Pigeon, deltaTime: number): void;
  clampVelocity(velocity: number, min: number, max: number): number;
}
```

## Error Handling

### Canvas Context Validation

- Check for Canvas API support on game initialization
- Graceful fallback message if Canvas is not supported
- Validate canvas context creation before starting game loop

### Audio Error Handling

- Catch and handle audio loading failures
- Provide silent fallback if Web Audio API is not available
- Handle audio playback errors without crashing the game

### Input Validation

- Sanitize and validate all user inputs
- Handle edge cases for rapid input events
- Prevent input processing during invalid game states

### Performance Error Handling

- Monitor frame rate and adjust quality if needed
- Handle browser tab visibility changes (pause when not visible)
- Catch and recover from rendering errors

## Testing Strategy

### Unit Testing

- **Entity Classes**: Test pigeon physics, pipe movement, collision detection
- **Game Logic**: Test scoring, game state transitions, input handling
- **Utility Functions**: Test collision detection, boundary checking, math utilities
- **Audio System**: Test sound loading, playback, and error handling

### Integration Testing

- **Game Loop**: Test complete update-render cycle
- **State Management**: Test transitions between game states
- **Input-to-Action**: Test input events triggering correct game responses
- **Score Persistence**: Test high score saving and loading

### Performance Testing

- **Frame Rate**: Ensure consistent 60 FPS performance
- **Memory Usage**: Test for memory leaks during extended gameplay
- **Canvas Rendering**: Test rendering performance with multiple entities
- **Audio Performance**: Test audio doesn't impact frame rate

### Browser Compatibility Testing

- Test on major browsers (Chrome, Firefox, Safari, Edge)
- Test responsive behavior on different screen sizes
- Test touch input on mobile devices
- Validate Canvas and Audio API support across browsers

### User Experience Testing

- **Gameplay Feel**: Test pigeon responsiveness and physics feel natural
- **Difficulty Curve**: Ensure game is challenging but fair
- **Visual Clarity**: Test all UI elements are clearly visible
- **Audio Balance**: Test sound effects enhance rather than distract from gameplay

## Implementation Notes

### Canvas Optimization

- Use `requestAnimationFrame` for smooth 60 FPS rendering
- Clear only necessary portions of canvas when possible
- Pre-render static elements to off-screen canvas for better performance

### Asset Management

- Use simple colored rectangles initially, can be replaced with sprites later
- Implement sprite animation system for pigeon wing flapping
- Consider using CSS for UI elements outside the game canvas

### Mobile Considerations

- Implement touch event handling for mobile devices
- Ensure game scales properly on different screen sizes
- Consider adding virtual controls for mobile if needed

### Extensibility

- Design allows for easy addition of power-ups or different pigeon types
- Pipe system can be extended for different obstacle types
- Score system can be enhanced with achievements or multipliers
