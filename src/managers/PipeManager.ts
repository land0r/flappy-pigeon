import { Pipe } from '../entities/Pipe.js';
import { Pigeon } from '../entities/Pigeon.js';
import { Rectangle } from '../types/GameTypes.js';
import { GAME_CONFIG } from '../config/GameConfig.js';

export class PipeManager {
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
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  public getPipes(): Pipe[] {
    return this.pipes;
  }
}
