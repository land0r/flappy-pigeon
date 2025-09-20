export class ScoreManager {
  private currentScore: number = 0;
  private highScore: number = 0;
  private readonly HIGH_SCORE_KEY = 'flappy-pigeon-high-score';

  constructor() {
    this.loadHighScore();
  }

  public addScore(points: number): void {
    this.currentScore += points;
    console.log(`Score increased by ${points}! Current score: ${this.currentScore}`);

    // Check if we have a new high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.saveHighScore();
      console.log(`New high score: ${this.highScore}!`);
    }
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public reset(): void {
    this.currentScore = 0;
    console.log('Score reset to 0');
  }

  public isNewHighScore(): boolean {
    return this.currentScore === this.highScore && this.currentScore > 0;
  }

  private saveHighScore(): void {
    try {
      localStorage.setItem(this.HIGH_SCORE_KEY, this.highScore.toString());
      console.log(`High score saved: ${this.highScore}`);
    } catch (error) {
      console.warn('Failed to save high score to localStorage:', error);
    }
  }

  private loadHighScore(): void {
    try {
      const savedScore = localStorage.getItem(this.HIGH_SCORE_KEY);
      if (savedScore !== null) {
        this.highScore = parseInt(savedScore, 10);
        if (isNaN(this.highScore)) {
          this.highScore = 0;
        }
        console.log(`High score loaded: ${this.highScore}`);
      }
    } catch (error) {
      console.warn('Failed to load high score from localStorage:', error);
      this.highScore = 0;
    }
  }

  public getScoreData(): { current: number; high: number; isNewHigh: boolean } {
    return {
      current: this.currentScore,
      high: this.highScore,
      isNewHigh: this.isNewHighScore(),
    };
  }
}
