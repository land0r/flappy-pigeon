# Flappy Pigeon

A simple Flappy Bird clone featuring a pigeon, built with HTML5 Canvas and TypeScript using modern architecture patterns.

## Features

🐦 **Pattie-Inspired Pigeon**: Custom-designed pigeon character matching WP Mail SMTP branding  
🎮 **Full Game Mechanics**: Physics, collision detection, scoring, and state management  
🎨 **Brand Colors**: Uses official WP Mail SMTP color palette  
📱 **Mobile Support**: Touch controls and responsive design  
⚡ **Modern Architecture**: Clean TypeScript with separation of concerns  

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

## Game Controls

- **Click** or **Spacebar**: Flap the pigeon's wings
- **P Key**: Pause/resume during gameplay
- Navigate through the pipes to score points!

## Architecture

The game follows modern TypeScript best practices with clear separation of concerns:

```
src/
├── types/          # TypeScript interfaces and types
│   └── GameTypes.ts
├── config/         # Game configuration and constants
│   └── GameConfig.ts
├── entities/       # Game entities (Pigeon, Pipe)
│   ├── Pigeon.ts
│   └── Pipe.ts
├── managers/       # System managers
│   ├── InputManager.ts
│   └── PipeManager.ts
├── renderers/      # Rendering logic
│   └── GameRenderer.ts
├── core/          # Core game engine
│   └── GameEngine.ts
└── main.ts        # Application entry point
```

### Key Design Patterns

- **Entity-Component Pattern**: Game entities implement common interfaces
- **Manager Pattern**: Separate managers for input, pipes, and rendering
- **State Pattern**: Clean game state management
- **Dependency Injection**: Components receive dependencies through constructors

## Completed Tasks

✅ **Task 1**: Project structure and HTML5 Canvas foundation  
✅ **Task 2**: Core game engine and state management  
✅ **Task 3**: Pigeon character with physics  
✅ **Task 4**: Pipe obstacle system  
✅ **Architecture Refactor**: Modern TypeScript architecture with best practices

## Brand Integration

The game uses the official WP Mail SMTP brand colors:
- `#395360` - Dark blue-gray (pipes, outlines)
- `#809EB0` - Medium blue-gray (pigeon body, sky)
- `#BDCFC8` - Light gray-green (pigeon head/chest, ground)
- `#E27730` - Orange (beak, pipe caps)
- `#85a197` - Custom eye socket color

## Next Steps

- Audio system and sound effects
- Visual enhancements and animations
- Mobile optimization
- Performance improvements
- High score persistence