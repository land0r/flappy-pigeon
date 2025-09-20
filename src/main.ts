// Game configuration constants
const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    GRAVITY: 0.5,
    FLAP_STRENGTH: -8,
    PIPE_SPEED: 2,
    PIPE_GAP: 150,
    PIPE_SPAWN_INTERVAL: 2000, // milliseconds
    PIGEON_SIZE: 40,
    PIPE_WIDTH: 60
} as const;

// Game state enumeration
enum GameState {
    MENU = 'menu',
    PLAYING = 'playing',
    GAME_OVER = 'game_over',
    PAUSED = 'paused'
}

// Input types
type InputType = 'flap' | 'pause';

// Rectangle interface for collision detection
interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Pigeon Class
class Pigeon {
    public x: number;
    public y: number;
    public velocity: number;
    public rotation: number;
    public isFlapping: boolean;
    private size: number;
    private maxVelocity: number;
    private minVelocity: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.rotation = 0;
        this.isFlapping = false;
        this.size = GAME_CONFIG.PIGEON_SIZE;
        this.maxVelocity = 10;  // Terminal velocity downward
        this.minVelocity = -12; // Max upward velocity
    }

    public flap(): void {
        this.velocity = GAME_CONFIG.FLAP_STRENGTH;
        this.isFlapping = true;
        console.log('Pigeon flapped! Velocity:', this.velocity);
    }

    public update(deltaTime: number): void {
        // Apply gravity
        this.velocity += GAME_CONFIG.GRAVITY * (deltaTime / 16); // Normalize for 60fps

        // Clamp velocity to prevent extreme speeds
        this.velocity = Math.max(this.minVelocity, Math.min(this.maxVelocity, this.velocity));

        // Update position
        this.y += this.velocity * (deltaTime / 16);

        // Update rotation based on velocity (diving/climbing effect)
        this.rotation = Math.max(-0.5, Math.min(0.5, this.velocity * 0.1));

        // Reset flapping state
        this.isFlapping = false;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();

        // Move to pigeon center for rotation
        context.translate(this.x + this.size / 2, this.y + this.size / 2);
        context.rotate(this.rotation);

        // Draw pigeon body (simple rectangle for now)
        context.fillStyle = '#8B4513'; // Brown color
        context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

        // Draw pigeon beak
        context.fillStyle = '#FFA500'; // Orange beak
        context.fillRect(this.size / 2 - 5, -3, 8, 6);

        // Draw wing (animated based on flapping)
        context.fillStyle = this.isFlapping ? '#654321' : '#8B4513';
        const wingOffset = this.isFlapping ? -2 : 0;
        context.fillRect(-this.size / 4, -this.size / 4 + wingOffset, this.size / 2, this.size / 3);

        // Draw eye
        context.fillStyle = '#000';
        context.beginPath();
        context.arc(this.size / 4, -this.size / 4, 3, 0, Math.PI * 2);
        context.fill();

        // Draw eye highlight
        context.fillStyle = '#FFF';
        context.beginPath();
        context.arc(this.size / 4 + 1, -this.size / 4 - 1, 1, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }

    public getBounds(): Rectangle {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size
        };
    }

    public reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.rotation = 0;
        this.isFlapping = false;
    }

    public isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
        return this.y < 0 || this.y + this.size > canvasHeight;
    }
}

// Pipe Class
class Pipe {
    public x: number;
    public topHeight: number;
    public bottomHeight: number;
    public gapSize: number;
    public passed: boolean;
    private width: number;

    constructor(x: number, canvasHeight: number) {
        this.x = x;
        this.width = GAME_CONFIG.PIPE_WIDTH;
        this.gapSize = GAME_CONFIG.PIPE_GAP;
        this.passed = false;

        // Randomize gap position (keep some margin from top and bottom)
        const minGapTop = 50;
        const maxGapTop = canvasHeight - this.gapSize - 50;
        const gapTop = Math.random() * (maxGapTop - minGapTop) + minGapTop;

        this.topHeight = gapTop;
        this.bottomHeight = canvasHeight - (gapTop + this.gapSize);
    }

    public update(deltaTime: number): void {
        // Move pipe from right to left
        this.x -= GAME_CONFIG.PIPE_SPEED * (deltaTime / 16);
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();

        // Draw top pipe
        context.fillStyle = '#228B22'; // Forest green
        context.fillRect(this.x, 0, this.width, this.topHeight);

        // Draw top pipe cap
        context.fillStyle = '#32CD32'; // Lime green
        context.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);

        // Draw bottom pipe
        context.fillStyle = '#228B22'; // Forest green
        context.fillRect(this.x, this.topHeight + this.gapSize, this.width, this.bottomHeight);

        // Draw bottom pipe cap
        context.fillStyle = '#32CD32'; // Lime green
        context.fillRect(this.x - 5, this.topHeight + this.gapSize, this.width + 10, 20);

        context.restore();
    }

    public getBounds(): Rectangle[] {
        return [
            // Top pipe
            {
                x: this.x,
                y: 0,
                width: this.width,
                height: this.topHeight
            },
            // Bottom pipe
            {
                x: this.x,
                y: this.topHeight + this.gapSize,
                width: this.width,
                height: this.bottomHeight
            }
        ];
    }

    public isOffScreen(): boolean {
        return this.x + this.width < 0;
    }

    public getGapCenter(): { x: number; y: number } {
        return {
            x: this.x + this.width / 2,
            y: this.topHeight + this.gapSize / 2
        };
    }
}

// Pipe Manager Class
class PipeManager {
    private pipes: Pipe[] = [];
    private spawnTimer: number = 0;
    private spawnInterval: number;
    private canvasHeight: number;

    constructor(canvasHeight: number) {
        this.canvasHeight = canvasHeight;
        this.spawnInterval = GAME_CONFIG.PIPE_SPAWN_INTERVAL;
    }

    public update(deltaTime: number): void {
        // Update spawn timer
        this.spawnTimer += deltaTime;

        // Spawn new pipe if interval has passed
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnPipe();
            this.spawnTimer = 0;
        }

        // Update all pipes
        for (const pipe of this.pipes) {
            pipe.update(deltaTime);
        }

        // Remove off-screen pipes
        this.pipes = this.pipes.filter(pipe => !pipe.isOffScreen());
    }

    public render(context: CanvasRenderingContext2D): void {
        for (const pipe of this.pipes) {
            pipe.render(context);
        }
    }

    public reset(): void {
        this.pipes = [];
        this.spawnTimer = 0;
        console.log('PipeManager reset');
    }

    private spawnPipe(): void {
        const pipe = new Pipe(800, this.canvasHeight); // Spawn at right edge
        this.pipes.push(pipe);
        console.log('New pipe spawned at x:', pipe.x);
    }

    public checkCollisions(pigeon: Pigeon): boolean {
        const pigeonBounds = pigeon.getBounds();

        for (const pipe of this.pipes) {
            const pipeBounds = pipe.getBounds();

            // Check collision with both top and bottom pipe segments
            for (const bounds of pipeBounds) {
                if (this.rectanglesCollide(pigeonBounds, bounds)) {
                    return true;
                }
            }
        }

        return false;
    }

    public checkScoring(pigeon: Pigeon): number {
        let score = 0;
        const pigeonBounds = pigeon.getBounds();
        const pigeonCenterX = pigeonBounds.x + pigeonBounds.width / 2;

        for (const pipe of this.pipes) {
            // Check if pigeon has passed through the pipe gap
            if (!pipe.passed && pigeonCenterX > pipe.x + GAME_CONFIG.PIPE_WIDTH) {
                pipe.passed = true;
                score++;
                console.log('Pigeon passed through pipe! Score +1');
            }
        }

        return score;
    }

    private rectanglesCollide(rect1: Rectangle, rect2: Rectangle): boolean {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }

    public getPipes(): Pipe[] {
        return this.pipes;
    }
}

// Input Manager Class
class InputManager {
    private canvas: HTMLCanvasElement | null = null;
    private inputCallback: ((inputType: InputType) => void) | null = null;
    private keysPressed: Set<string> = new Set();

    public initialize(canvas: HTMLCanvasElement, inputCallback: (inputType: InputType) => void): void {
        this.canvas = canvas;
        this.inputCallback = inputCallback;

        this.setupEventListeners();
        console.log('InputManager initialized');
    }

    private setupEventListeners(): void {
        if (!this.canvas || !this.inputCallback) return;

        // Mouse click events
        this.canvas.addEventListener('click', this.handleClick.bind(this));

        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Touch events for mobile support
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        console.log('Input event listeners set up');
    }

    private handleClick(event: MouseEvent): void {
        event.preventDefault();
        this.triggerFlapInput();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // Prevent default behavior for game keys
        if (event.code === 'Space' || event.code === 'KeyP') {
            event.preventDefault();
        }

        // Avoid key repeat
        if (this.keysPressed.has(event.code)) {
            return;
        }

        this.keysPressed.add(event.code);

        switch (event.code) {
            case 'Space':
                this.triggerFlapInput();
                break;
            case 'KeyP':
                this.triggerPauseInput();
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keysPressed.delete(event.code);
    }

    private handleTouchStart(event: TouchEvent): void {
        event.preventDefault();
        this.triggerFlapInput();
    }

    private triggerFlapInput(): void {
        if (this.inputCallback) {
            this.inputCallback('flap');
        }
    }

    private triggerPauseInput(): void {
        if (this.inputCallback) {
            this.inputCallback('pause');
        }
    }

    public reset(): void {
        this.keysPressed.clear();
        console.log('InputManager reset');
    }
}

// Game Engine Class
class GameEngine {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private gameState: GameState;
    private lastFrameTime: number;
    private animationId: number | null;
    private inputManager: InputManager;
    private pigeon: Pigeon;
    private pipeManager: PipeManager;
    private score: number;

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

        // Initialize input manager
        this.inputManager = new InputManager();
        this.inputManager.initialize(this.canvas, this.handleInput.bind(this));

        // Initialize pigeon
        this.pigeon = new Pigeon(150, this.canvas.height / 2 - GAME_CONFIG.PIGEON_SIZE / 2);

        // Initialize pipe manager
        this.pipeManager = new PipeManager(this.canvas.height);

        // Initialize score
        this.score = 0;

        console.log('GameEngine initialized');
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
        console.log('Game engine stopped');
    }

    private gameLoop = (currentTime: number): void => {
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(this.gameLoop);
    };

    private update(deltaTime: number): void {
        switch (this.gameState) {
            case GameState.MENU:
                // Menu is ready for input
                break;
            case GameState.PLAYING:
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
                this.score += newScore;
                break;
            case GameState.GAME_OVER:
                // Game over screen is ready for input
                break;
            case GameState.PAUSED:
                // Paused - no updates
                break;
        }
    }

    private render(): void {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render background
        this.renderBackground();

        // Render based on current state
        switch (this.gameState) {
            case GameState.MENU:
                this.renderStartScreen();
                break;
            case GameState.PLAYING:
                this.renderGame();
                break;
            case GameState.GAME_OVER:
                this.renderGameOver();
                break;
            case GameState.PAUSED:
                this.renderGame();
                this.renderPauseOverlay();
                break;
        }
    }

    private renderBackground(): void {
        const gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(1, '#98FB98'); // Light green
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private renderStartScreen(): void {
        this.context.save();

        // Title
        this.context.fillStyle = '#333';
        this.context.font = 'bold 48px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        // Add text shadow for better visibility
        this.context.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.context.shadowBlur = 4;
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;

        this.context.fillText('🐦 Flappy Pigeon', this.canvas.width / 2, this.canvas.height / 2 - 80);

        // Instructions
        this.context.font = '24px Arial';
        this.context.shadowBlur = 2;
        this.context.fillText('Click or press SPACE to start', this.canvas.width / 2, this.canvas.height / 2 - 20);

        this.context.font = '18px Arial';
        this.context.fillText('Navigate through the pipes to score points!', this.canvas.width / 2, this.canvas.height / 2 + 20);

        // Controls
        this.context.font = '16px Arial';
        this.context.fillStyle = '#666';
        this.context.fillText('Controls: Click, SPACE to flap | P to pause', this.canvas.width / 2, this.canvas.height / 2 + 60);

        this.context.restore();
    }

    private renderGame(): void {
        // Render pipes first (background)
        this.pipeManager.render(this.context);

        // Render the pigeon (foreground)
        this.pigeon.render(this.context);

        // Render UI elements
        this.context.save();

        // Score display
        this.context.fillStyle = '#333';
        this.context.font = 'bold 32px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        this.context.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.context.shadowBlur = 3;
        this.context.fillText(`Score: ${this.score}`, this.canvas.width / 2, 20);

        // Instructions
        this.context.font = '16px Arial';
        this.context.textAlign = 'left';
        this.context.shadowBlur = 1;
        this.context.fillText('Click or SPACE to flap', 10, 10);
        this.context.fillText('Press P to pause', 10, 30);

        // Debug info
        this.context.fillText(`Velocity: ${this.pigeon.velocity.toFixed(1)}`, 10, 50);
        this.context.fillText(`Pipes: ${this.pipeManager.getPipes().length}`, 10, 70);

        this.context.restore();
    }

    private renderGameOver(): void {
        this.context.save();

        // Semi-transparent overlay
        this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Game Over text
        this.context.fillStyle = '#ff4444';
        this.context.font = 'bold 48px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.context.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.context.shadowBlur = 4;
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;

        this.context.fillText('💀 Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 60);

        // Final score
        this.context.fillStyle = '#333';
        this.context.font = '28px Arial';
        this.context.shadowBlur = 2;
        this.context.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 10);

        // Restart instruction
        this.context.font = '20px Arial';
        this.context.fillText('Click or press SPACE to restart', this.canvas.width / 2, this.canvas.height / 2 + 30);

        this.context.restore();
    }

    private renderPauseOverlay(): void {
        this.context.save();

        // Semi-transparent overlay
        this.context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Pause text
        this.context.fillStyle = '#fff';
        this.context.font = 'bold 48px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('⏸️ PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 20);

        this.context.font = '20px Arial';
        this.context.fillText('Press P to resume', this.canvas.width / 2, this.canvas.height / 2 + 30);

        this.context.restore();
    }

    private handleInput(inputType: InputType): void {
        switch (inputType) {
            case 'flap':
                this.handleFlapInput();
                break;
            case 'pause':
                this.handlePauseInput();
                break;
        }
    }

    private handleFlapInput(): void {
        switch (this.gameState) {
            case GameState.MENU:
                this.startGame();
                break;
            case GameState.PLAYING:
                // Make the pigeon flap
                this.pigeon.flap();
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

    private startGame(): void {
        // Reset pigeon to starting position
        this.pigeon.reset(150, this.canvas.height / 2 - GAME_CONFIG.PIGEON_SIZE / 2);

        // Reset pipes
        this.pipeManager.reset();

        // Reset score
        this.score = 0;

        this.gameState = GameState.PLAYING;
        console.log('Game started');
    }

    private restartGame(): void {
        // Reset game state and entities
        this.pigeon.reset(150, this.canvas.height / 2 - GAME_CONFIG.PIGEON_SIZE / 2);
        this.pipeManager.reset();
        this.score = 0;
        this.gameState = GameState.MENU;
        console.log('Game restarted');
    }

    public getCurrentState(): GameState {
        return this.gameState;
    }

    public setGameOver(): void {
        this.gameState = GameState.GAME_OVER;
        console.log('Game over');
    }
}

// Initialize and start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    try {
        // Get canvas element
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Set canvas dimensions
        canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

        // Create and start the game engine
        const gameEngine = new GameEngine(canvas);
        gameEngine.start();

        console.log('Flappy Pigeon game started successfully!');

        // Handle page visibility changes to pause/resume game
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Auto-pause when tab becomes hidden
                if (gameEngine.getCurrentState() === GameState.PLAYING) {
                    console.log('Tab hidden - game will auto-pause on next P key press');
                }
            }
        });

        // Handle window beforeunload to cleanup
        window.addEventListener('beforeunload', () => {
            gameEngine.stop();
        });

    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Failed to initialize the game. Please check if your browser supports HTML5 Canvas.');
    }
});