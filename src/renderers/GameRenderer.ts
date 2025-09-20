import { BRAND_COLORS, CLOUD_CONFIG } from '../config/GameConfig.js';
import { Pigeon } from '../entities/Pigeon.js';
import { Pipe } from '../entities/Pipe.js';
import { Cloud } from '../types/GameTypes.js';

export class GameRenderer {
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private clouds: Cloud[];

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.clouds = [];
    this.initializeClouds();
  }

  public renderBackground(deltaTime?: number): void {
    // Enhanced gradient background with multiple color stops
    const gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#9BB5D1'); // Lighter sky blue
    gradient.addColorStop(0.3, BRAND_COLORS.mediumBlue); // Brand medium blue-gray
    gradient.addColorStop(0.7, BRAND_COLORS.lightGray); // Brand light gray-green
    gradient.addColorStop(1, '#A8C4A2'); // Slightly darker ground
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add enhanced cloud rendering with animation
    this.renderClouds(deltaTime);
  }

  private renderClouds(deltaTime?: number): void {
    // Update cloud positions if deltaTime is provided
    if (deltaTime !== undefined) {
      this.updateCloudPositions(deltaTime);
    }

    // Render each cloud with organic shapes (with culling for performance)
    for (const cloud of this.clouds) {
      // Simple culling: only render clouds that are potentially visible
      const cloudWidth = cloud.width * cloud.scale;
      if (cloud.x + cloudWidth >= 0 && cloud.x <= this.canvas.width) {
        this.drawCloudShape(cloud);
      }
    }
  }

  public renderStartScreen(highScore?: number): void {
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

    this.context.fillText('🐦 Flappy Pigeon', this.canvas.width / 2, this.canvas.height / 2 - 100);

    // High score display
    if (highScore && highScore > 0) {
      this.context.font = '20px Arial';
      this.context.fillStyle = '#666';
      this.context.shadowBlur = 1;
      this.context.fillText(
        `High Score: ${highScore}`,
        this.canvas.width / 2,
        this.canvas.height / 2 - 60
      );
    }

    // Instructions
    this.context.fillStyle = '#333';
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

    // Enhanced score display with background
    this.renderScoreDisplay(score);

    // Enhanced instructions with better styling
    this.renderInstructions();

    // Debug info (smaller and less prominent)
    this.renderDebugInfo(velocity, pipeCount);

    this.context.restore();
  }

  private renderScoreDisplay(score: number): void {
    // Score background
    this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.context.fillRect(this.canvas.width / 2 - 80, 10, 160, 50);

    // Score border
    this.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.context.lineWidth = 2;
    this.context.strokeRect(this.canvas.width / 2 - 80, 10, 160, 50);

    // Score text with enhanced styling
    this.context.fillStyle = '#FFF';
    this.context.font = 'bold 28px Arial, sans-serif';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.context.shadowBlur = 4;
    this.context.shadowOffsetX = 2;
    this.context.shadowOffsetY = 2;
    this.context.fillText(`Score: ${score}`, this.canvas.width / 2, 35);
  }

  private renderInstructions(): void {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.context.fillRect(5, 5, 200, 50);

    this.context.fillStyle = '#FFF';
    this.context.font = '14px Arial, sans-serif';
    this.context.textAlign = 'left';
    this.context.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.context.shadowBlur = 2;
    this.context.fillText('Click or SPACE to flap', 10, 20);
    this.context.fillText('Press P to pause', 10, 40);
  }

  private renderDebugInfo(velocity: number, pipeCount: number): void {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.context.font = '12px monospace';
    this.context.textAlign = 'left';
    this.context.shadowBlur = 1;
    this.context.fillText(`V: ${velocity.toFixed(1)}`, 10, this.canvas.height - 30);
    this.context.fillText(`Pipes: ${pipeCount}`, 10, this.canvas.height - 15);
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

  public renderGameOver(scoreData: { current: number; high: number; isNewHigh: boolean }): void {
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

    this.context.fillText('💀 Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 80);

    // Final score
    this.context.fillStyle = '#333';
    this.context.font = '28px Arial';
    this.context.shadowBlur = 2;
    this.context.fillText(
      `Final Score: ${scoreData.current}`,
      this.canvas.width / 2,
      this.canvas.height / 2 - 30
    );

    // High score display
    if (scoreData.isNewHigh) {
      this.context.fillStyle = '#FFD700'; // Gold color for new high score
      this.context.font = '24px Arial';
      this.context.fillText(
        '🎉 NEW HIGH SCORE! 🎉',
        this.canvas.width / 2,
        this.canvas.height / 2 + 10
      );
    } else {
      this.context.fillStyle = '#666';
      this.context.font = '20px Arial';
      this.context.fillText(
        `High Score: ${scoreData.high}`,
        this.canvas.width / 2,
        this.canvas.height / 2 + 10
      );
    }

    // Restart instruction
    this.context.fillStyle = '#333';
    this.context.font = '18px Arial';
    this.context.fillText(
      'Click or press SPACE to restart',
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
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

  private updateCloudPositions(deltaTime: number): void {
    // Skip update if deltaTime is too large (tab switching, etc.)
    if (deltaTime > 100) {
      return;
    }

    for (const cloud of this.clouds) {
      // Move cloud horizontally based on its speed
      cloud.x += cloud.speed * (deltaTime / 16.67); // Normalize to 60 FPS

      // Wrap cloud to left side when it moves off the right edge
      if (cloud.x > this.canvas.width + cloud.width * cloud.scale) {
        cloud.x = -cloud.width * cloud.scale;

        // Randomize properties when wrapping for variety
        cloud.y = this.canvas.height * 0.15 + Math.random() * CLOUD_CONFIG.Y_VARIANCE;
        cloud.opacity =
          CLOUD_CONFIG.MIN_OPACITY +
          Math.random() * (CLOUD_CONFIG.MAX_OPACITY - CLOUD_CONFIG.MIN_OPACITY);
        cloud.speed =
          CLOUD_CONFIG.MIN_SPEED +
          Math.random() * (CLOUD_CONFIG.MAX_SPEED - CLOUD_CONFIG.MIN_SPEED);
        cloud.scale =
          CLOUD_CONFIG.MIN_SCALE +
          Math.random() * (CLOUD_CONFIG.MAX_SCALE - CLOUD_CONFIG.MIN_SCALE);
      }
    }
  }

  private drawCloudShape(cloud: Cloud): void {
    // Verify context exists and cloud has valid properties
    if (!this.context || !cloud || cloud.scale <= 0) {
      return;
    }

    this.context.save();

    // Calculate actual dimensions with scale
    const width = cloud.width * cloud.scale;
    const height = cloud.height * cloud.scale;

    // Create gradient for depth and volume
    const gradient = this.context.createRadialGradient(
      cloud.x + width * 0.3,
      cloud.y + height * 0.3,
      0,
      cloud.x + width * 0.5,
      cloud.y + height * 0.5,
      width * 0.8
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 1.2})`);
    gradient.addColorStop(0.6, `rgba(255, 255, 255, ${cloud.opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${cloud.opacity * 0.3})`);

    this.context.fillStyle = gradient;

    // Create organic cloud shape using quadratic curves
    this.context.beginPath();

    // Start from left side
    this.context.moveTo(cloud.x, cloud.y + height * 0.5);

    // Top-left curve
    this.context.quadraticCurveTo(
      cloud.x + width * 0.1,
      cloud.y,
      cloud.x + width * 0.3,
      cloud.y + height * 0.2
    );

    // Top-center bumps for fluffy appearance
    this.context.quadraticCurveTo(
      cloud.x + width * 0.4,
      cloud.y - height * 0.1,
      cloud.x + width * 0.6,
      cloud.y + height * 0.1
    );

    // Top-right curve
    this.context.quadraticCurveTo(
      cloud.x + width * 0.8,
      cloud.y - height * 0.05,
      cloud.x + width,
      cloud.y + height * 0.4
    );

    // Right side
    this.context.quadraticCurveTo(
      cloud.x + width * 1.1,
      cloud.y + height * 0.6,
      cloud.x + width * 0.9,
      cloud.y + height * 0.8
    );

    // Bottom-right curve
    this.context.quadraticCurveTo(
      cloud.x + width * 0.7,
      cloud.y + height * 1.1,
      cloud.x + width * 0.5,
      cloud.y + height * 0.9
    );

    // Bottom-left curve
    this.context.quadraticCurveTo(
      cloud.x + width * 0.2,
      cloud.y + height * 1.05,
      cloud.x,
      cloud.y + height * 0.7
    );

    // Close the path back to start
    this.context.closePath();

    try {
      this.context.fill();
    } catch (error) {
      // Gracefully handle any canvas rendering errors
      console.warn('Cloud rendering error:', error);
    }

    this.context.restore();
  }

  private initializeClouds(): void {
    this.clouds = [];

    // Validate cloud configuration
    const cloudCount = Math.max(1, Math.min(CLOUD_CONFIG.COUNT || 5, 10)); // Limit to reasonable range

    for (let i = 0; i < cloudCount; i++) {
      // Distribute clouds across screen width with some spacing
      const baseX = (this.canvas.width / CLOUD_CONFIG.COUNT) * i;
      const randomOffsetX = Math.random() * (this.canvas.width / CLOUD_CONFIG.COUNT);

      // Random Y position in upper portion of screen
      const baseY = this.canvas.height * 0.15; // Start at 15% from top
      const randomOffsetY = Math.random() * CLOUD_CONFIG.Y_VARIANCE;

      const cloud: Cloud = {
        x: baseX + randomOffsetX,
        y: baseY + randomOffsetY,
        width: CLOUD_CONFIG.BASE_WIDTH,
        height: CLOUD_CONFIG.BASE_HEIGHT,
        opacity:
          CLOUD_CONFIG.MIN_OPACITY +
          Math.random() * (CLOUD_CONFIG.MAX_OPACITY - CLOUD_CONFIG.MIN_OPACITY),
        speed:
          CLOUD_CONFIG.MIN_SPEED +
          Math.random() * (CLOUD_CONFIG.MAX_SPEED - CLOUD_CONFIG.MIN_SPEED),
        scale:
          CLOUD_CONFIG.MIN_SCALE +
          Math.random() * (CLOUD_CONFIG.MAX_SCALE - CLOUD_CONFIG.MIN_SCALE),
      };

      this.clouds.push(cloud);
    }

    console.log(`Enhanced cloud system initialized with ${this.clouds.length} clouds`);
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
