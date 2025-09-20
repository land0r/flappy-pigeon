import { InputType } from '../types/GameTypes.js';

export class InputManager {
  private canvas: HTMLCanvasElement | null = null;
  private inputCallback: ((inputType: InputType) => void) | null = null;
  private keysPressed: Set<string> = new Set();

  public initialize(
    canvas: HTMLCanvasElement,
    inputCallback: (inputType: InputType) => void
  ): void {
    this.canvas = canvas;
    this.inputCallback = inputCallback;

    this.setupEventListeners();
    console.log('InputManager initialized');
  }

  private setupEventListeners(): void {
    if (!this.canvas || !this.inputCallback) {
      return;
    }

    // Mouse click events
    this.canvas.addEventListener('click', this.handleClick.bind(this));

    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Touch events for mobile support
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));

    // Prevent context menu on right click
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());

    console.log('Input event listeners set up');
  }

  private handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.triggerFlapInput();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Prevent default behavior for game keys
    if (event.code === 'Space' || event.code === 'KeyP' || event.code === 'KeyM') {
      event.preventDefault();
    }

    // Avoid key repeat
    if (this.keysPressed.has(event.code)) {
      return;
    }

    this.keysPressed.add(event.code);

    switch (event.code) {
      case 'Space':
        this.triggerFlapInput();
        break;
      case 'KeyP':
        this.triggerPauseInput();
        break;
      case 'KeyM':
        this.triggerMuteInput();
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keysPressed.delete(event.code);
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.triggerFlapInput();
  }

  private triggerFlapInput(): void {
    if (this.inputCallback) {
      this.inputCallback('flap');
    }
  }

  private triggerPauseInput(): void {
    if (this.inputCallback) {
      this.inputCallback('pause');
    }
  }

  private triggerMuteInput(): void {
    if (this.inputCallback) {
      this.inputCallback('mute');
    }
  }

  public reset(): void {
    this.keysPressed.clear();
    console.log('InputManager reset');
  }

  public cleanup(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleClick.bind(this));
      this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      this.canvas.removeEventListener('contextmenu', e => e.preventDefault());
    }

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));

    this.canvas = null;
    this.inputCallback = null;
    this.keysPressed.clear();

    console.log('InputManager cleaned up');
  }
}
