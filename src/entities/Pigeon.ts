import { GameEntity, Rectangle } from '../types/GameTypes.js';
import { GAME_CONFIG, BRAND_COLORS } from '../config/GameConfig.js';

export class Pigeon implements GameEntity {
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

        // Draw pigeon body (rounded, more bird-like)
        context.fillStyle = BRAND_COLORS.mediumBlue;
        context.beginPath();
        context.ellipse(0, 0, this.size / 2.2, this.size / 2.5, 0, 0, Math.PI * 2);
        context.fill();

        // Draw pigeon head (slightly overlapping body)
        context.fillStyle = BRAND_COLORS.lightGray;
        context.beginPath();
        context.ellipse(this.size / 6, -this.size / 6, this.size / 3.5, this.size / 3.5, 0, 0, Math.PI * 2);
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
        context.fillStyle = BRAND_COLORS.lightGray;
        
        // Left feather
        context.beginPath();
        context.ellipse(this.size / 12, -this.size / 2.2, this.size / 8, this.size / 6, -0.3, 0, Math.PI * 2);
        context.fill();
        
        // Right feather
        context.beginPath();
        context.ellipse(this.size / 4, -this.size / 2.4, this.size / 10, this.size / 7, 0.2, 0, Math.PI * 2);
        context.fill();
        
        // Center feather (tallest)
        context.beginPath();
        context.ellipse(this.size / 6, -this.size / 1.9, this.size / 9, this.size / 5, 0, 0, Math.PI * 2);
        context.fill();
    }

    private renderBeak(context: CanvasRenderingContext2D): void {
        // Draw beak (orange, more rounded like Pattie)
        context.fillStyle = BRAND_COLORS.orange;
        context.beginPath();
        context.ellipse(this.size / 2.2, -this.size / 8, this.size / 8, this.size / 12, 0, 0, Math.PI * 2);
        context.fill();

        // Draw beak details (nostrils)
        context.fillStyle = '#D4611A'; // Darker orange for nostrils
        context.beginPath();
        context.arc(this.size / 2.4, -this.size / 7, 1, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(this.size / 2.4, -this.size / 9, 1, 0, Math.PI * 2);
        context.fill();
    }

    private renderWing(context: CanvasRenderingContext2D): void {
        const wingColor = this.isFlapping ? BRAND_COLORS.darkBlue : BRAND_COLORS.mediumBlue;
        context.fillStyle = wingColor;
        const wingOffset = this.isFlapping ? -3 : 0;

        context.beginPath();
        context.ellipse(-this.size / 8, this.size / 12 + wingOffset, this.size / 3, this.size / 4.5, -0.3, 0, Math.PI * 2);
        context.fill();

        // Draw wing details
        context.fillStyle = BRAND_COLORS.darkBlue;
        context.beginPath();
        context.ellipse(-this.size / 6, this.size / 10 + wingOffset, this.size / 5, this.size / 8, -0.3, 0, Math.PI * 2);
        context.fill();
    }

    private renderTailFeathers(context: CanvasRenderingContext2D): void {
        context.fillStyle = BRAND_COLORS.darkBlue;
        context.beginPath();
        context.ellipse(-this.size / 2.2, this.size / 8, this.size / 6, this.size / 3, 0.5, 0, Math.PI * 2);
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
        context.fillStyle = BRAND_COLORS.lightGray;
        for (let i = 0; i < 3; i++) {
            const featherY = this.size / 6 + (i * this.size / 12);
            const featherX = this.size / 12 + (i * this.size / 20);
            
            // Draw overlapping semicircles to create scalloped pattern
            context.beginPath();
            context.arc(featherX - this.size / 8, featherY, this.size / 12, Math.PI, 0);
            context.fill();
            context.beginPath();
            context.arc(featherX, featherY, this.size / 12, Math.PI, 0);
            context.fill();
            context.beginPath();
            context.arc(featherX + this.size / 8, featherY, this.size / 12, Math.PI, 0);
            context.fill();
        }
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