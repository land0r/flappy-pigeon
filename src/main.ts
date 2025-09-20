import { GAME_CONFIG } from './config/GameConfig.js';
import { GameEngine } from './core/GameEngine.js';
import { GameState } from './types/GameTypes.js';

/**
 * Main entry point for Flappy Pigeon game
 * Initializes the game engine and handles application lifecycle
 */
class Application {
  private gameEngine: GameEngine | null = null;

  public async initialize(): Promise<void> {
    try {
      // Get canvas element
      const canvas = this.getCanvasElement();

      // Set canvas dimensions
      this.setupCanvas(canvas);

      // Create and start the game engine
      this.gameEngine = new GameEngine(canvas);
      this.gameEngine.start();

      // Setup application event handlers
      this.setupEventHandlers();

      console.log('Flappy Pigeon game started successfully!');
    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  private getCanvasElement(): HTMLCanvasElement {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    return canvas;
  }

  private setupCanvas(canvas: HTMLCanvasElement): void {
    canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
  }

  private setupEventHandlers(): void {
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

  private handleInitializationError(error: unknown): void {
    console.error('Failed to initialize game:', error);
    alert('Failed to initialize the game. Please check if your browser supports HTML5 Canvas.');
  }

  public cleanup(): void {
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
