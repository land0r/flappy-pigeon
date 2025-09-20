import { GameConfig } from '../types/GameTypes.js';

// Game configuration constants
export const GAME_CONFIG: GameConfig = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRAVITY: 0.5,
  FLAP_STRENGTH: -8,
  PIPE_SPEED: 2,
  PIPE_GAP: 150,
  PIPE_SPAWN_INTERVAL: 2000, // milliseconds
  PIGEON_SIZE: 40,
  PIPE_WIDTH: 60,
} as const;

// Cloud configuration for enhanced rendering
export const CLOUD_CONFIG = {
  COUNT: 5,
  MIN_SPEED: 0.5,
  MAX_SPEED: 2.0,
  MIN_SCALE: 0.8,
  MAX_SCALE: 1.4,
  MIN_OPACITY: 0.1,
  MAX_OPACITY: 0.3,
  BASE_WIDTH: 80,
  BASE_HEIGHT: 40,
  Y_VARIANCE: 100,
} as const;

// Responsive design configuration
export const RESPONSIVE_CONFIG = {
  BASE_WIDTH: 800,
  BASE_HEIGHT: 600,
  MIN_WIDTH: 320,
  MIN_HEIGHT: 240,
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 900,
  ASPECT_RATIO: 4 / 3, // 800:600 ratio
  MOBILE_BREAKPOINT: 768,
  SCALE_FACTOR_MOBILE: 0.8, // Scale down elements on mobile
} as const;

// Brand colors from WP Mail SMTP
export const BRAND_COLORS = {
  darkBlue: '#395360', // Dark blue-gray
  mediumBlue: '#809EB0', // Medium blue-gray
  lightGray: '#BDCFC8', // Light gray-green
  orange: '#E27730', // Orange accent
  eyeSocket: '#85a197', // Custom eye socket color
} as const;
