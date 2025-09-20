# Technology Stack

## Core Technologies
- **TypeScript 5.9.2** - Primary language with strict type checking
- **HTML5 Canvas** - 2D rendering and game graphics
- **ES2020 Modules** - Modern JavaScript module system
- **No runtime dependencies** - Pure browser-based implementation

## Build System
- **TypeScript Compiler (tsc)** - Compiles to ES2020 modules
- **Output**: `dist/` directory with source maps and declarations
- **Target**: ES2020 with DOM libraries

## Development Tools
- **live-server** - Development server with hot reload
- **concurrently** - Runs multiple npm scripts simultaneously
- **Python HTTP server** - Simple production-like serving

## Common Commands

### Development (Recommended)
```bash
npm run dev
```
Runs TypeScript watch + live-server with automatic browser refresh on file changes.

### Individual Commands
```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript to dist/
npm run watch        # TypeScript watch mode only
npm run serve        # Start Python HTTP server on port 8000
npm run clean        # Remove dist/ directory
npm run start        # Build + serve (production-like)
```

### Development Workflow
1. Run `npm run dev` for hot reload development
2. Browser automatically opens at `http://localhost:8000`
3. Changes to TypeScript files trigger automatic compilation and browser refresh
4. Changes to `index.html` also trigger browser refresh

## TypeScript Configuration
- **Strict mode enabled** - All strict type checking options
- **ES2020 target** - Modern JavaScript features
- **Source maps** - For debugging compiled code
- **Declaration files** - Generated for all modules
- **Module resolution**: Node.js style with `.js` extensions required in imports