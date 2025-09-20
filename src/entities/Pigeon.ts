import { GAME_CONFIG } from '../config/GameConfig.js';
import { GameEntity, Rectangle } from '../types/GameTypes.js';

export class Pigeon implements GameEntity {
  public x: number;
  public y: number;
  public velocity: number;
  public rotation: number;
  public isFlapping: boolean;
  private size: number;
  private maxVelocity: number;
  private minVelocity: number;
  private animationTime: number = 0;
  private spriteSheet: HTMLImageElement | null = null;
  private frameWidth: number = 0;
  private frameHeight: number = 0;
  private totalFrames: number = 7;
  private currentFrame: number = 0;
  private frameTimer: number = 0;
  private frameDelay: number = 100; // milliseconds between frames
  private spriteLoaded: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.rotation = 0;
    this.isFlapping = false;
    this.size = GAME_CONFIG.PIGEON_SIZE;
    this.maxVelocity = 10; // Terminal velocity downward
    this.minVelocity = -12; // Max upward velocity
    this.loadSpriteSheet();
  }

  private loadSpriteSheet(): void {
    this.spriteSheet = new Image();
    this.spriteSheet.onload = () => {
      this.frameWidth = this.spriteSheet!.width / this.totalFrames;
      this.frameHeight = this.spriteSheet!.height;
      this.spriteLoaded = true;
      console.log(`Sprite sheet loaded: ${this.frameWidth}x${this.frameHeight} per frame`);
    };
    this.spriteSheet.onerror = () => {
      console.error('Failed to load pigeon sprite sheet');
    };
    this.spriteSheet.src = './assets/sprites/pigeon-sprite-sheet.png';
  }

  public flap(): void {
    this.velocity = GAME_CONFIG.FLAP_STRENGTH;
    this.isFlapping = true;
    console.log('Pigeon flapped! Velocity:', this.velocity);
  }

  public update(deltaTime: number): void {
    // Update animation timer for subtle effects
    this.animationTime += deltaTime;

    // Update frame animation
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.frameTimer = 0;

      // Speed up animation when flapping
      if (this.isFlapping) {
        this.frameDelay = 60; // Faster animation when flapping
      } else {
        this.frameDelay = 100; // Normal animation speed
      }
    }

    // Apply gravity
    this.velocity += GAME_CONFIG.GRAVITY * (deltaTime / 16); // Normalize for 60fps

    // Clamp velocity to prevent extreme speeds
    this.velocity = Math.max(this.minVelocity, Math.min(this.maxVelocity, this.velocity));

    // Update position
    this.y += this.velocity * (deltaTime / 16);

    // Enhanced rotation based on velocity with smoother transitions
    const targetRotation = Math.max(-0.6, Math.min(0.4, this.velocity * 0.12));
    // Smooth rotation interpolation for more natural movement
    this.rotation += (targetRotation - this.rotation) * 0.15;

    // Reset flapping state
    this.isFlapping = false;
  }

  public render(context: CanvasRenderingContext2D): void {
    // If sprite isn't loaded yet, don't render anything
    if (!this.spriteLoaded || !this.spriteSheet) {
      return;
    }

    context.save();

    // Add subtle floating animation
    const floatOffset = Math.sin(this.animationTime * 0.003) * 1.5;

    // Move to pigeon center for rotation with floating effect
    context.translate(this.x + this.size / 2, this.y + this.size / 2 + floatOffset);
    context.rotate(this.rotation);

    // Calculate source rectangle for current frame
    const sourceX = this.currentFrame * this.frameWidth;
    const sourceY = 0;

    // Draw the sprite frame centered
    context.drawImage(
      this.spriteSheet,
      sourceX, sourceY, this.frameWidth, this.frameHeight,
      -this.size / 2, -this.size / 2, this.size, this.size
    );

    context.restore();
  }


  public getBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
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
    return (
      this.y < 0 ||
      this.y + this.size > canvasHeight ||
      this.x + this.size < 0 ||
      this.x > canvasWidth
    );
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
