import { GameEngine } from './core/GameEngine.js';
import { GameState } from './types/GameTypes.js';
import { CanvasDimensions, ResponsiveCanvas } from './utils/ResponsiveCanvas.js';

/**
 * Main entry point for Flappy Pigeon game
 * Initializes the game engine and handles application lifecycle
 */
class Application {
  private gameEngine: GameEngine | null = null;
  private responsiveCanvas: ResponsiveCanvas | null = null;

  public async initialize(): Promise<void> {
    try {
      // Get canvas element
      const canvas = this.getCanvasElement();
      const context = this.getCanvasContext(canvas);

      // Setup responsive canvas system
      this.responsiveCanvas = new ResponsiveCanvas(canvas, context);
      this.responsiveCanvas.setResizeCallback(this.handleCanvasResize.bind(this));

      // Create and initialize the game engine
      this.gameEngine = new GameEngine(canvas);
      await this.gameEngine.initialize();

      // Pass responsive canvas to game engine
      if (this.gameEngine.setResponsiveCanvas) {
        this.gameEngine.setResponsiveCanvas(this.responsiveCanvas);
      }

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

  private getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D rendering context');
    }
    return context;
  }

  private handleCanvasResize(dimensions: CanvasDimensions): void {
    // Notify game engine about canvas resize if it supports it
    if (this.gameEngine && this.gameEngine.handleResize) {
      this.gameEngine.handleResize(dimensions);
    }
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
    if (this.responsiveCanvas) {
      this.responsiveCanvas.cleanup();
      this.responsiveCanvas = null;
    }
  }
}

// Initialize and start the application when the page loads
window.addEventListener('DOMContentLoaded', async () => {
  const app = new Application();
  await app.initialize();
});
