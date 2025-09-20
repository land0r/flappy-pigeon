import { RESPONSIVE_CONFIG } from '../config/GameConfig.js';

export interface CanvasDimensions {
  width: number;
  height: number;
  scaleFactor: number;
  isMobile: boolean;
}

export class ResponsiveCanvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private resizeCallback?: (dimensions: CanvasDimensions) => void;
  private currentDimensions: CanvasDimensions;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.currentDimensions = this.calculateDimensions();

    this.setupCanvas();
    this.setupEventListeners();
  }

  public setResizeCallback(callback: (dimensions: CanvasDimensions) => void): void {
    this.resizeCallback = callback;
  }

  public getCurrentDimensions(): CanvasDimensions {
    return { ...this.currentDimensions };
  }

  private calculateDimensions(): CanvasDimensions {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isMobile = windowWidth <= RESPONSIVE_CONFIG.MOBILE_BREAKPOINT;

    // Calculate available space (accounting for padding and UI elements)
    const availableWidth = windowWidth - (isMobile ? 10 : 40); // Account for padding
    const availableHeight = windowHeight - (isMobile ? 60 : 120); // Account for title and padding

    // Calculate dimensions maintaining aspect ratio
    let canvasWidth: number = RESPONSIVE_CONFIG.BASE_WIDTH;
    let canvasHeight: number = RESPONSIVE_CONFIG.BASE_HEIGHT;

    // Scale down to fit available space
    const widthScale = availableWidth / canvasWidth;
    const heightScale = availableHeight / canvasHeight;
    const scale = Math.min(widthScale, heightScale, 1); // Don't scale up beyond base size

    canvasWidth = Math.max(RESPONSIVE_CONFIG.MIN_WIDTH, canvasWidth * scale);
    canvasHeight = Math.max(RESPONSIVE_CONFIG.MIN_HEIGHT, canvasHeight * scale);

    // Ensure we don't exceed maximum dimensions
    canvasWidth = Math.min(RESPONSIVE_CONFIG.MAX_WIDTH, canvasWidth);
    canvasHeight = Math.min(RESPONSIVE_CONFIG.MAX_HEIGHT, canvasHeight);

    // Maintain aspect ratio
    const aspectRatio = RESPONSIVE_CONFIG.ASPECT_RATIO;
    if (canvasWidth / canvasHeight > aspectRatio) {
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      canvasHeight = canvasWidth / aspectRatio;
    }

    const scaleFactor = isMobile ? RESPONSIVE_CONFIG.SCALE_FACTOR_MOBILE : 1;

    return {
      width: Math.round(canvasWidth),
      height: Math.round(canvasHeight),
      scaleFactor,
      isMobile,
    };
  }

  private setupCanvas(): void {
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    const dimensions = this.calculateDimensions();

    // Set canvas internal dimensions
    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;

    // Set canvas display size (CSS)
    this.canvas.style.width = `${dimensions.width}px`;
    this.canvas.style.height = `${dimensions.height}px`;

    // Configure context for crisp rendering
    this.context.imageSmoothingEnabled = false;

    // Update current dimensions
    this.currentDimensions = dimensions;

    // Notify callback if dimensions changed significantly
    if (this.resizeCallback) {
      this.resizeCallback(dimensions);
    }

    console.log(
      `Canvas resized to ${dimensions.width}x${dimensions.height} (mobile: ${dimensions.isMobile})`
    );
  }

  private setupEventListeners(): void {
    // Debounced resize handler
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.updateCanvasSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Add small delay for orientation change to complete
      setTimeout(handleResize, 200);
    });
  }

  public cleanup(): void {
    // Remove event listeners if needed
    // (In this simple implementation, we don't store references to remove them)
  }

  // Utility method to scale coordinates for responsive design
  public scaleCoordinate(coordinate: number, isHorizontal: boolean = true): number {
    const baseDimension = isHorizontal
      ? RESPONSIVE_CONFIG.BASE_WIDTH
      : RESPONSIVE_CONFIG.BASE_HEIGHT;
    const currentDimension = isHorizontal
      ? this.currentDimensions.width
      : this.currentDimensions.height;
    return (coordinate * currentDimension) / baseDimension;
  }

  // Utility method to scale sizes for responsive design
  public scaleSize(size: number): number {
    const scale = Math.min(
      this.currentDimensions.width / RESPONSIVE_CONFIG.BASE_WIDTH,
      this.currentDimensions.height / RESPONSIVE_CONFIG.BASE_HEIGHT
    );
    return size * scale * this.currentDimensions.scaleFactor;
  }
}
