# Flappy Pigeon

A simple Flappy Bird clone featuring a pigeon, built with HTML5 Canvas and TypeScript.

## Getting Started

### Prerequisites
- Node.js and npm installed
- A modern web browser with HTML5 Canvas support

### Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start a local server:
```bash
npm run serve
```

4. Open your browser and navigate to `http://localhost:8000`

### Development

For development with automatic TypeScript compilation:
```bash
npm run watch
```

Or run both TypeScript compilation and server together:
```bash
npm run dev
```

## Game Controls

- **Click** or **Spacebar**: Flap the pigeon's wings
- Navigate through the pipes to score points!

## Current Status

✅ Task 1: Basic project structure and HTML5 Canvas foundation
- HTML5 Canvas setup with responsive design
- TypeScript configuration and build system
- Basic game loop with requestAnimationFrame
- Game state management (Menu, Playing, Game Over, Paused)
- Input handling for mouse clicks and keyboard

## Next Steps

The game currently shows basic screens and state transitions. The next tasks will add:
- Pigeon character with physics
- Pipe obstacles
- Collision detection
- Scoring system
- Visual enhancements and audio