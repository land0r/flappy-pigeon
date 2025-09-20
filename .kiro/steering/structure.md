# Project Structure

## Directory Organization

```
flappy-pigeon/
├── src/                    # TypeScript source code
│   ├── types/             # TypeScript interfaces and type definitions
│   │   └── GameTypes.ts   # Core game types, enums, interfaces
│   ├── config/            # Configuration and constants
│   │   └── GameConfig.ts  # Game settings and brand colors
│   ├── entities/          # Game objects and entities
│   │   ├── Pigeon.ts      # Player character with physics
│   │   └── Pipe.ts        # Obstacle entities
│   ├── managers/          # System management classes
│   │   ├── InputManager.ts    # Keyboard/mouse input handling
│   │   └── PipeManager.ts     # Pipe spawning and management
│   ├── renderers/         # Rendering and graphics
│   │   └── GameRenderer.ts    # Canvas rendering logic
│   ├── core/              # Core game systems
│   │   └── GameEngine.ts      # Main game loop and state management
│   └── main.ts            # Application entry point
├── dist/                  # Compiled JavaScript output (generated)
├── index.html             # Main HTML file with canvas element
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Architecture Patterns

### Entity-Component Pattern

- All game entities implement `GameEntity` interface
- Common `update(deltaTime)` and `render(context)` methods
- Position properties (`x`, `y`) on all entities

### Manager Pattern

- Separate managers for different systems (Input, Pipes, Rendering)
- Managers handle specific responsibilities and are injected into GameEngine
- Clean separation of concerns

### State Pattern

- `GameState` enum defines all possible game states
- GameEngine switches behavior based on current state
- Clear state transitions with logging

### Dependency Injection

- Components receive dependencies through constructors
- GameEngine orchestrates all managers and entities
- No global state or singletons

## File Naming Conventions

- **PascalCase** for class files (`GameEngine.ts`, `PipeManager.ts`)
- **camelCase** for configuration files (`GameConfig.ts`, `GameTypes.ts`)
- **kebab-case** for project name and directories
- **Descriptive names** that indicate purpose (`InputManager`, `GameRenderer`)

## Import Conventions

- **Explicit `.js` extensions** required in imports (TypeScript ES modules)
- **Relative imports** for local modules (`./config/GameConfig.js`)
- **Barrel exports** not used - direct file imports preferred
- **Type-only imports** when importing only types

## Code Organization Rules

- **One class per file** with matching filename
- **Interfaces and types** in dedicated `types/` directory
- **Constants and configuration** in `config/` directory
- **Business logic** separated from rendering logic
- **Private methods** prefixed with `private` keyword consistently
