import { GAME_CONFIG } from '../config/GameConfig.js';
import { Pigeon } from '../entities/Pigeon.js';
import { AudioManager } from '../managers/AudioManager.js';
import { InputManager } from '../managers/InputManager.js';
import { PipeManager } from '../managers/PipeManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { GameRenderer } from '../renderers/GameRenderer.js';
import { GameState, InputType } from '../types/GameTypes.js';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private gameState: GameState;
  private lastFrameTime: number;
  private animationId: number | null;

  // Managers and entities
  private audioManager!: AudioManager;
  private inputManager!: InputManager;
  private pigeon!: Pigeon;
  private pipeManager!: PipeManager;
  private scoreManager!: ScoreManager;
  private renderer!: GameRenderer;

  // Game state
  private debugMode: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D rendering context');
    }
    this.context = context;

    this.gameState = GameState.MENU;
    this.lastFrameTime = 0;
    this.animationId = null;

    console.log('GameEngine initialized');
  }

  public async initialize(): Promise<void> {
    // Initialize managers and entities
    await this.initializeComponents();
    console.log('GameEngine components initialized');
  }

  private async initializeComponents(): Promise<void> {
    // Initialize audio manager first
    this.audioManager = new AudioManager();
    await this.audioManager.loadSounds();

    // Initialize input manager
    this.inputManager = new InputManager();
    this.inputManager.initialize(this.canvas, this.handleInput.bind(this));

    // Initialize pigeon
    this.pigeon = new Pigeon(150, this.canvas.height / 2 - GAME_CONFIG.PIGEON_SIZE / 2);

    // Initialize pipe manager
    this.pipeManager = new PipeManager(this.canvas.height);

    // Initialize score manager
    this.scoreManager = new ScoreManager();

    // Initialize renderer
    this.renderer = new GameRenderer(this.canvas, this.context);
  }

  public start(): void {
    console.log('Starting game engine...');
    this.gameLoop(0);
  }

  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.inputManager.cleanup();
    this.audioManager.cleanup();
    console.log('Game engine stopped');
  }

  private gameLoop = (currentTime: number): void => {
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    this.update(deltaTime);
    this.render(deltaTime);

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    switch (this.gameState) {
      case GameState.MENU:
        // Menu is ready for input
        break;
      case GameState.PLAYING:
        this.updateGameplay(deltaTime);
        break;
      case GameState.GAME_OVER:
        // Game over screen is ready for input
        break;
      case GameState.PAUSED:
        // Paused - no updates
        break;
    }
  }

  private updateGameplay(deltaTime: number): void {
    // Update pigeon physics
    this.pigeon.update(deltaTime);

    // Update pipes
    this.pipeManager.update(deltaTime);

    // Check boundary collisions
    if (this.pigeon.isOutOfBounds(this.canvas.width, this.canvas.height)) {
      this.setGameOver();
    }

    // Check pipe collisions
    if (this.pipeManager.checkCollisions(this.pigeon)) {
      this.setGameOver();
    }

    // Check scoring
    const newScore = this.pipeManager.checkScoring(this.pigeon);
    if (newScore > 0) {
      this.scoreManager.addScore(newScore);
      this.audioManager.playSound('score');
    }
  }

  private render(deltaTime: number): void {
    // Clear canvas
    this.renderer.clear();

    // Render background with animation only when playing (clouds pause when game is paused)
    const animationDeltaTime = this.gameState === GameState.PLAYING ? deltaTime : undefined;
    this.renderer.renderBackground(animationDeltaTime);

    // Render based on current state
    switch (this.gameState) {
      case GameState.MENU:
        this.renderer.renderStartScreen(this.scoreManager.getHighScore());
        break;
      case GameState.PLAYING:
        this.renderGameplay();
        break;
      case GameState.GAME_OVER:
        this.renderGameplay();
        this.renderer.renderGameOver(this.scoreManager.getScoreData());
        break;
      case GameState.PAUSED:
        this.renderGameplay();
        this.renderer.renderPauseOverlay();
        break;
    }
  }

  private renderGameplay(): void {
    // Render pipes first (background)
    this.pipeManager.render(this.context);

    // Render the pigeon (foreground)
    this.pigeon.render(this.context);

    // Render debug bounds if enabled (press D to toggle)
    if (this.debugMode) {
      this.renderer.renderDebugBounds(this.pigeon, this.pipeManager.getPipes());
    }

    // Render UI
    this.renderer.renderGameUI(
      this.scoreManager.getCurrentScore(),
      this.pigeon.velocity,
      this.pipeManager.getPipes().length,
      this.audioManager.isMutedState()
    );
  }

  private handleInput(inputType: InputType): void {
    switch (inputType) {
      case 'flap':
        this.handleFlapInput();
        break;
      case 'pause':
        this.handlePauseInput();
        break;
      case 'mute':
        this.handleMuteInput();
        break;
    }
  }

  private handleFlapInput(): void {
    switch (this.gameState) {
      case GameState.MENU:
        this.startGame();
        break;
      case GameState.PLAYING:
        this.pigeon.flap();
        this.audioManager.playSound('flap');
        break;
      case GameState.GAME_OVER:
        this.restartGame();
        break;
    }
  }

  private handlePauseInput(): void {
    switch (this.gameState) {
      case GameState.PLAYING:
        this.gameState = GameState.PAUSED;
        console.log('Game paused');
        break;
      case GameState.PAUSED:
        this.gameState = GameState.PLAYING;
        console.log('Game resumed');
        break;
    }
  }

  private handleMuteInput(): void {
    this.audioManager.toggleMute();
  }

  private startGame(): void {
    // Reset pigeon to starting position
    this.pigeon.reset(150, this.canvas.height / 2 - GAME_CONFIG.PIGEON_SIZE / 2);

    // Reset pipes
    this.pipeManager.reset();

    // Reset score
    this.scoreManager.reset();

    this.gameState = GameState.PLAYING;
    console.log('Game started');
  }

  private restartGame(): void {
    // Reset game state and entities
    this.pigeon.reset(150, this.canvas.height / 2 - GAME_CONFIG.PIGEON_SIZE / 2);
    this.pipeManager.reset();
    this.scoreManager.reset();
    this.gameState = GameState.MENU;
    console.log('Game restarted');
  }

  public getCurrentState(): GameState {
    return this.gameState;
  }

  public getAudioMuteState(): boolean {
    return this.audioManager.isMutedState();
  }

  public setGameOver(): void {
    this.gameState = GameState.GAME_OVER;
    this.audioManager.playSound('gameOver');
    console.log('Game over');
  }
}
