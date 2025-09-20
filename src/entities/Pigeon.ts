import { BRAND_COLORS, GAME_CONFIG } from '../config/GameConfig.js';
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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.rotation = 0;
    this.isFlapping = false;
    this.size = GAME_CONFIG.PIGEON_SIZE;
    this.maxVelocity = 10; // Terminal velocity downward
    this.minVelocity = -12; // Max upward velocity
  }

  public flap(): void {
    this.velocity = GAME_CONFIG.FLAP_STRENGTH;
    this.isFlapping = true;
    console.log('Pigeon flapped! Velocity:', this.velocity);
  }

  public update(deltaTime: number): void {
    // Update animation timer for subtle effects
    this.animationTime += deltaTime;

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
    context.save();

    // Add subtle floating animation
    const floatOffset = Math.sin(this.animationTime * 0.003) * 1.5;

    // Move to pigeon center for rotation with floating effect
    context.translate(this.x + this.size / 2, this.y + this.size / 2 + floatOffset);
    context.rotate(this.rotation);

    // Draw pigeon body (more egg-shaped like Pattie)
    context.fillStyle = BRAND_COLORS.mediumBlue;
    context.beginPath();
    context.ellipse(0, this.size / 12, this.size / 2.5, this.size / 2.2, 0, 0, Math.PI * 2);
    context.fill();

    // Draw pigeon head/chest area (larger, like Pattie's prominent head)
    context.fillStyle = BRAND_COLORS.lightGray;
    context.beginPath();
    context.ellipse(
      this.size / 5,
      -this.size / 8,
      this.size / 3,
      this.size / 3.2,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Draw head feathers/crest (like Pattie's distinctive top feathers)
    this.renderHeadFeathers(context);

    // Draw beak
    this.renderBeak(context);

    // Draw wing
    this.renderWing(context);

    // Draw tail feathers
    this.renderTailFeathers(context);

    // Draw eye
    this.renderEye(context);

    // Draw scalloped chest feathers
    this.renderChestFeathers(context);

    context.restore();
  }

  private renderHeadFeathers(context: CanvasRenderingContext2D): void {
    // Same color as head (light gray) and only 2 small feathers like Pattie
    context.fillStyle = BRAND_COLORS.lightGray;

    // Left small feather
    context.beginPath();
    context.ellipse(
      this.size / 8,
      -this.size / 2.2,
      this.size / 20,
      this.size / 12,
      -0.2,
      0,
      Math.PI * 2
    );
    context.fill();

    // Right small feather
    context.beginPath();
    context.ellipse(
      this.size / 4,
      -this.size / 2.3,
      this.size / 20,
      this.size / 12,
      0.2,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  private renderBeak(context: CanvasRenderingContext2D): void {
    // Draw beak (small, simple triangle like a real pigeon in profile)
    context.fillStyle = BRAND_COLORS.orange;
    context.beginPath();
    context.moveTo(this.size / 2.2, -this.size / 10);
    context.lineTo(this.size / 1.8, -this.size / 12);
    context.lineTo(this.size / 2.2, -this.size / 20);
    context.closePath();
    context.fill();

    // Small nostril
    context.fillStyle = '#D4611A';
    context.beginPath();
    context.arc(this.size / 2.4, -this.size / 15, 0.5, 0, Math.PI * 2);
    context.fill();
  }

  private renderWing(context: CanvasRenderingContext2D): void {
    // Enhanced wing animation with multiple states
    const wingColor = this.isFlapping ? BRAND_COLORS.darkBlue : BRAND_COLORS.mediumBlue;
    context.fillStyle = wingColor;

    // More dramatic wing movement
    const wingOffset = this.isFlapping ? -4 : 0;
    const wingRotation = this.isFlapping ? -0.4 : -0.1;
    const wingScale = this.isFlapping ? 1.2 : 1.0;

    context.save();
    context.translate(-this.size / 10, this.size / 12 + wingOffset);
    context.rotate(wingRotation);
    context.scale(wingScale, 1);

    // Main wing shape with enhanced animation
    context.beginPath();
    context.ellipse(0, 0, this.size / 5, this.size / 8, 0, 0, Math.PI * 2);
    context.fill();

    // Wing tip detail that moves more dramatically
    context.fillStyle = BRAND_COLORS.darkBlue;
    context.beginPath();
    context.ellipse(-this.size / 8, 0, this.size / 12, this.size / 16, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  private renderTailFeathers(context: CanvasRenderingContext2D): void {
    // Much smaller, simpler tail
    context.fillStyle = BRAND_COLORS.darkBlue;
    context.beginPath();
    context.ellipse(
      -this.size / 2.5,
      this.size / 12,
      this.size / 12,
      this.size / 8,
      0.3,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  private renderEye(context: CanvasRenderingContext2D): void {
    // Draw eye socket (oval background in custom color)
    context.fillStyle = BRAND_COLORS.eyeSocket;
    context.beginPath();
    context.ellipse(this.size / 5, -this.size / 5, 6, 4.5, 0, 0, Math.PI * 2);
    context.fill();

    // Draw eye (white eye with black pupil)
    context.fillStyle = '#FFF';
    context.beginPath();
    context.arc(this.size / 5, -this.size / 5, 4, 0, Math.PI * 2);
    context.fill();

    // Draw pupil (black circle inside the white eye)
    context.fillStyle = '#000';
    context.beginPath();
    context.arc(this.size / 5, -this.size / 5, 2, 0, Math.PI * 2);
    context.fill();
  }

  private renderChestFeathers(context: CanvasRenderingContext2D): void {
    // Much simpler chest pattern - just 2 small semicircles
    context.fillStyle = BRAND_COLORS.lightGray;

    // Just two small chest feathers
    context.beginPath();
    context.arc(-this.size / 12, this.size / 6, this.size / 16, Math.PI, 0);
    context.fill();

    context.beginPath();
    context.arc(this.size / 12, this.size / 6, this.size / 16, Math.PI, 0);
    context.fill();
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
