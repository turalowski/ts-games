export const FPS = 60;
export const WINNING_SCORE = 10;
export const CANVAS_HEIGHT = 600;
export const CANVAS_WIDTH = 800;
export const PADDLE_HEIGHT = 100;
export const PADDLE_WIDTH = 10;
export const initialBallState = {
  x: 50,
  y: 50,
  radius: 10,
  x_speed: 4,
  y_speed: 4,
};
export const initialPaddleState = {
  width: 10,
  height: 100,
};
export const initialPaddleLeft = {
  ...initialPaddleState,
  x: 0,
  y: 250,
};

export const initialPaddleRight = {
  ...initialPaddleState,
  x: CANVAS_WIDTH - PADDLE_WIDTH,
  y: 250,
};

export const initialGameState = {
  left: 0,
  right: 0,
};
