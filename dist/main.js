import { GAME_CONFIG } from './config/GameConfig.js';
import { GameEngine } from './core/GameEngine.js';
import { GameState } from './types/GameTypes.js';
/**
 * Main entry point for Flappy Pigeon game
 * Initializes the game engine and handles application lifecycle
 */
class Application {
    constructor() {
        this.gameEngine = null;
    }
    async initialize() {
        try {
            // Get canvas element
            const canvas = this.getCanvasElement();
            // Set canvas dimensions
            this.setupCanvas(canvas);
            // Create and initialize the game engine
            this.gameEngine = new GameEngine(canvas);
            await this.gameEngine.initialize();
            this.gameEngine.start();
            // Setup application event handlers
            this.setupEventHandlers();
            console.log('Flappy Pigeon game started successfully!');
        }
        catch (error) {
            this.handleInitializationError(error);
        }
    }
    getCanvasElement() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        return canvas;
    }
    setupCanvas(canvas) {
        canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
    }
    setupEventHandlers() {
        if (!this.gameEngine) {
            return;
        }
        // Handle page visibility changes to pause/resume game
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameEngine) {
                // Auto-pause when tab becomes hidden
                if (this.gameEngine.getCurrentState() === GameState.PLAYING) {
                    console.log('Tab hidden - game will auto-pause on next P key press');
                }
            }
        });
        // Handle window beforeunload to cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    handleInitializationError(error) {
        console.error('Failed to initialize game:', error);
        alert('Failed to initialize the game. Please check if your browser supports HTML5 Canvas.');
    }
    cleanup() {
        if (this.gameEngine) {
            this.gameEngine.stop();
            this.gameEngine = null;
        }
    }
}
// Initialize and start the application when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const app = new Application();
    await app.initialize();
});
//# sourceMappingURL=main.js.map