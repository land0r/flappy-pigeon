export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private isLoaded: boolean = false;

  constructor() {
    // Load mute state from localStorage
    const savedMuteState = localStorage.getItem('flappy-pigeon-muted');
    this.isMuted = savedMuteState === 'true';
  }

  /**
   * Initialize and load all sound effects
   */
  public async loadSounds(): Promise<void> {
    try {
      // Create audio elements for each sound effect
      const soundFiles = {
        flap: this.createBeepSound(400, 0.1, 'sine'), // High pitched beep for flap
        score: this.createBeepSound(600, 0.2, 'square'), // Higher pitched beep for score
        gameOver: this.createBeepSound(200, 0.5, 'sawtooth'), // Low pitched beep for game over
      };

      // Store all sounds in the map
      for (const [name, audio] of Object.entries(soundFiles)) {
        this.sounds.set(name, audio);
      }

      this.isLoaded = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize audio system:', error);
      // Continue without audio - graceful degradation
      this.isLoaded = false;
    }
  }

  /**
   * Create a simple beep sound using generated WAV data
   */
  private createBeepSound(frequency: number, duration: number, waveType: string): HTMLAudioElement {
    // Create a simple WAV file with a beep sound
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);

    // Generate beep samples based on wave type
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let amplitude = 0;

      // Generate different waveforms
      switch (waveType) {
        case 'sine':
          amplitude = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          amplitude = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          amplitude = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        default:
          amplitude = Math.sin(2 * Math.PI * frequency * t);
      }

      // Apply envelope (fade out)
      const envelope = Math.max(0, 1 - t / duration);
      const sample = Math.floor(amplitude * envelope * 0.3 * 32767);
      view.setInt16(44 + i * 2, sample, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);
    audio.preload = 'auto';
    audio.volume = 0.3; // Set a reasonable volume

    return audio;
  }

  /**
   * Play a sound effect by name
   */
  public playSound(soundName: string): void {
    if (!this.isLoaded || this.isMuted) {
      return;
    }

    const sound = this.sounds.get(soundName);
    if (!sound) {
      console.warn(`Sound '${soundName}' not found`);
      return;
    }

    try {
      // Reset the audio to the beginning and play
      sound.currentTime = 0;
      const playPromise = sound.play();

      // Handle play promise for browsers that require user interaction
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`Failed to play sound '${soundName}':`, error);
        });
      }
    } catch (error) {
      console.warn(`Error playing sound '${soundName}':`, error);
    }
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    localStorage.setItem('flappy-pigeon-muted', this.isMuted.toString());
    console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Get current mute state
   */
  public isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Set mute state
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('flappy-pigeon-muted', this.isMuted.toString());
  }

  /**
   * Check if audio system is loaded and ready
   */
  public isReady(): boolean {
    return this.isLoaded;
  }

  /**
   * Cleanup audio resources
   */
  public cleanup(): void {
    this.sounds.forEach(sound => {
      sound.pause();
      if (sound.src.startsWith('blob:')) {
        URL.revokeObjectURL(sound.src);
      }
      sound.src = '';
    });
    this.sounds.clear();
    console.log('Audio system cleaned up');
  }
}
