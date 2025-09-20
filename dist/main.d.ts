declare const GAME_CONFIG: {
    readonly CANVAS_WIDTH: 800;
    readonly CANVAS_HEIGHT: 600;
    readonly GRAVITY: 0.5;
    readonly FLAP_STRENGTH: -8;
    readonly PIPE_SPEED: 2;
    readonly PIPE_GAP: 150;
    readonly PIPE_SPAWN_INTERVAL: 2000;
    readonly PIGEON_SIZE: 40;
    readonly PIPE_WIDTH: 60;
};
declare enum GameState {
    MENU = "menu",
    PLAYING = "playing",
    GAME_OVER = "game_over",
    PAUSED = "paused"
}
type InputType = 'flap' | 'pause';
interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
declare class Pigeon {
    x: number;
    y: number;
    velocity: number;
    rotation: number;
    isFlapping: boolean;
    private size;
    private maxVelocity;
    private minVelocity;
    constructor(x: number, y: number);
    flap(): void;
    update(deltaTime: number): void;
    render(context: CanvasRenderingContext2D): void;
    getBounds(): Rectangle;
    reset(x: number, y: number): void;
    isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean;
}
declare class Pipe {
    x: number;
    topHeight: number;
    bottomHeight: number;
    gapSize: number;
    passed: boolean;
    private width;
    constructor(x: number, canvasHeight: number);
    update(deltaTime: number): void;
    render(context: CanvasRenderingContext2D): void;
    getBounds(): Rectangle[];
    isOffScreen(): boolean;
    getGapCenter(): {
        x: number;
        y: number;
    };
}
declare class PipeManager {
    private pipes;
    private spawnTimer;
    private spawnInterval;
    private canvasHeight;
    constructor(canvasHeight: number);
    update(deltaTime: number): void;
    render(context: CanvasRenderingContext2D): void;
    reset(): void;
    private spawnPipe;
    checkCollisions(pigeon: Pigeon): boolean;
    checkScoring(pigeon: Pigeon): number;
    private rectanglesCollide;
    getPipes(): Pipe[];
}
declare class InputManager {
    private canvas;
    private inputCallback;
    private keysPressed;
    initialize(canvas: HTMLCanvasElement, inputCallback: (inputType: InputType) => void): void;
    private setupEventListeners;
    private handleClick;
    private handleKeyDown;
    private handleKeyUp;
    private handleTouchStart;
    private triggerFlapInput;
    private triggerPauseInput;
    reset(): void;
}
declare class GameEngine {
    private canvas;
    private context;
    private gameState;
    private lastFrameTime;
    private animationId;
    private inputManager;
    private pigeon;
    private pipeManager;
    private score;
    constructor(canvas: HTMLCanvasElement);
    start(): void;
    stop(): void;
    private gameLoop;
    private update;
    private render;
    private renderBackground;
    private renderStartScreen;
    private renderGame;
    private renderGameOver;
    private renderPauseOverlay;
    private handleInput;
    private handleFlapInput;
    private handlePauseInput;
    private startGame;
    private restartGame;
    getCurrentState(): GameState;
    setGameOver(): void;
}
//# sourceMappingURL=main.d.ts.map