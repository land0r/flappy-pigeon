import { BRAND_COLORS } from '../config/GameConfig.js';
import { Pigeon } from '../entities/Pigeon.js';
import { Pipe } from '../entities/Pipe.js';

export class GameRenderer {
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  public renderBackground(): void {
    const gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, BRAND_COLORS.mediumBlue); // Brand medium blue-gray (sky)
    gradient.addColorStop(1, BRAND_COLORS.lightGray); // Brand light gray-green (ground)
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public renderStartScreen(): void {
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
    this.context.fillText(
      'Click or press SPACE to start',
      this.canvas.width / 2,
      this.canvas.height / 2 - 20
    );

    this.context.font = '18px Arial';
    this.context.fillText(
      'Navigate through the pipes to score points!',
      this.canvas.width / 2,
      this.canvas.height / 2 + 20
    );

    // Controls
    this.context.font = '16px Arial';
    this.context.fillStyle = '#666';
    this.context.fillText(
      'Controls: Click, SPACE to flap | P to pause',
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );

    this.context.restore();
  }

  public renderGameUI(score: number, velocity: number, pipeCount: number): void {
    this.context.save();

    // Score display
    this.context.fillStyle = '#333';
    this.context.font = 'bold 32px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    this.context.shadowColor = 'rgba(255, 255, 255, 0.8)';
    this.context.shadowBlur = 3;
    this.context.fillText(`Score: ${score}`, this.canvas.width / 2, 20);

    // Instructions
    this.context.font = '16px Arial';
    this.context.textAlign = 'left';
    this.context.shadowBlur = 1;
    this.context.fillText('Click or SPACE to flap', 10, 10);
    this.context.fillText('Press P to pause', 10, 30);

    // Debug info
    this.context.fillText(`Velocity: ${velocity.toFixed(1)}`, 10, 50);
    this.context.fillText(`Pipes: ${pipeCount}`, 10, 70);

    this.context.restore();
  }

  public renderDebugBounds(pigeon: Pigeon, pipes: Pipe[]): void {
    // Optional debug rendering for collision bounds
    this.context.save();
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 2;

    // Draw pigeon bounds
    const pigeonBounds = pigeon.getBounds();
    this.context.strokeRect(
      pigeonBounds.x,
      pigeonBounds.y,
      pigeonBounds.width,
      pigeonBounds.height
    );

    // Draw pipe bounds
    this.context.strokeStyle = 'blue';
    for (const pipe of pipes) {
      const pipeBounds = pipe.getBounds();
      for (const bounds of pipeBounds) {
        this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      }
    }

    this.context.restore();
  }

  public renderGameOver(score: number): void {
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
    this.context.fillText(
      `Final Score: ${score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 - 10
    );

    // Restart instruction
    this.context.font = '20px Arial';
    this.context.fillText(
      'Click or press SPACE to restart',
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );

    this.context.restore();
  }

  public renderPauseOverlay(): void {
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

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
