import { BRAND_COLORS, GAME_CONFIG } from '../config/GameConfig.js';
import { GameEntity, Rectangle } from '../types/GameTypes.js';

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
    const pipeHighlight = '#4A6B7A'; // Lighter shade for 3D effect

    // Draw top pipe with gradient for 3D effect
    const topGradient = context.createLinearGradient(this.x, 0, this.x + this.width, 0);
    topGradient.addColorStop(0, pipeHighlight);
    topGradient.addColorStop(0.3, pipeColor);
    topGradient.addColorStop(1, pipeColor);

    context.fillStyle = topGradient;
    context.fillRect(this.x, 0, this.width, this.topHeight);

    // Draw top pipe cap with enhanced styling
    const capGradient = context.createLinearGradient(this.x - 5, 0, this.x + this.width + 5, 0);
    capGradient.addColorStop(0, '#F49C42'); // Lighter orange
    capGradient.addColorStop(0.5, pipeCapColor);
    capGradient.addColorStop(1, '#C86A28'); // Darker orange

    context.fillStyle = capGradient;
    context.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);

    // Draw bottom pipe with gradient
    const bottomGradient = context.createLinearGradient(this.x, 0, this.x + this.width, 0);
    bottomGradient.addColorStop(0, pipeHighlight);
    bottomGradient.addColorStop(0.3, pipeColor);
    bottomGradient.addColorStop(1, pipeColor);

    context.fillStyle = bottomGradient;
    context.fillRect(this.x, this.topHeight + this.gapSize, this.width, this.bottomHeight);

    // Draw bottom pipe cap with enhanced styling
    context.fillStyle = capGradient;
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
