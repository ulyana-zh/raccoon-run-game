export const WIDTH = 1062;
export const HEIGHT = 600;

export const METER = WIDTH / (WIDTH / 10);

export const SPEED = 14.5;
export const GRAVITY = 4;
export const STARS_COUNT = 50;

export const PLATFORM_WIDTH = METER * 4.9;
export const PLATFORM_HEIGHT = METER * 9.9;
export const PLATFORM_BASE = HEIGHT - PLATFORM_HEIGHT;

export const PLAYER_STATES = ['run', 'jump', 'slide', 'crouch', 'win'];
export const PLAYER_WIDTH = METER * 20;
export const PLAYER_HEIGHT = METER * 15.6;

export const GAP_LENGTH_MIN = SPEED - 10;
export const GAP_LENGTH_MAX = SPEED - 8;
export const PLATFORM_LENGTH_MIN = SPEED / 4;
export const PLATFORM_LENGTH_MAX = SPEED;

export const FONT = 'Londrina Solid, cursive';
export const FONT_COLOR = "rgba(255, 244, 220, 1)";
