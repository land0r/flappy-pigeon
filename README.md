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

**🔥 Best Development Experience (Hot Reload):**

```bash
npm run dev
```

This runs TypeScript watch + live-server with automatic browser refresh.

**Individual Commands:**

```bash
npm run watch       # TypeScript watch mode only
npm run serve       # Basic Python server only
npm run clean       # Clean build directory
npm run start       # Build + serve (production-like)
```

**Code Quality:**

```bash
npm run lint        # Check TypeScript code with ESLint
npm run lint:fix    # Auto-fix ESLint issues
npm run format      # Format all files with Prettier
npm run format:check # Check if files are formatted
npm run check       # Run lint + format check + build
```

**🚀 Hot Reload Features:**

- ⚡ **Instant refresh** - Browser reloads automatically on file changes
- 🔄 **Smart watching** - Monitors dist/ and index.html changes
- 🎯 **Fast feedback** - See changes immediately

**VS Code Users:**

- Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Development Server"
- Or use the integrated TypeScript watch task

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

### Code Quality Tools

- **ESLint**: TypeScript linting with strict rules
- **Prettier**: Automatic code formatting for TS/HTML/CSS/JSON
- **VS Code Integration**: Auto-format on save and lint on type
- **Pre-commit Checks**: `npm run check` validates code before commits

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
