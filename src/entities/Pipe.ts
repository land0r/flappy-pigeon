import { GameEntity, Rectangle } from '../types/GameTypes.js';
import { GAME_CONFIG, BRAND_COLORS } from '../config/GameConfig.js';

export class Pipe implements GameEntity {
  public x: number;
  public y: number = 0; // Required by GameEntity interface
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

    const pipeColor = BRAND_COLORS.darkBlue;
    const pipeCapColor = BRAND_COLORS.orange;

    // Draw top pipe
    context.fillStyle = pipeColor;
    context.fillRect(this.x, 0, this.width, this.topHeight);

    // Draw top pipe cap
    context.fillStyle = pipeCapColor;
    context.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);

    // Draw bottom pipe
    context.fillStyle = pipeColor;
    context.fillRect(this.x, this.topHeight + this.gapSize, this.width, this.bottomHeight);

    // Draw bottom pipe cap
    context.fillStyle = pipeCapColor;
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
        height: this.topHeight,
      },
      // Bottom pipe
      {
        x: this.x,
        y: this.topHeight + this.gapSize,
        width: this.width,
        height: this.bottomHeight,
      },
    ];
  }

  public isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  public getGapCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.topHeight + this.gapSize / 2,
    };
  }
}
