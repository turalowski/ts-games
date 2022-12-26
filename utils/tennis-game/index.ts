export const FPS = 60;
export const CANVAS_HEIGHT = 600;
export const CANVAS_WIDTH = 800;
export let BALL_X = 50;
export let BALL_Y = 50;
export let BALL_X_SPEED = 2;
export let BALL_Y_SPEED = 2;

export function checkCornersAndUpdateSpeed() {
  // left
  if (BALL_X > CANVAS_WIDTH) {
    BALL_X_SPEED = -2;
  }
  // right
  if (BALL_X < 0) {
    BALL_X_SPEED = 2;
  }
  // top
  if (BALL_Y < 0) {
    BALL_Y_SPEED = 2;
  }
  // bottom
  if (BALL_Y > CANVAS_HEIGHT) {
    BALL_Y_SPEED = -2;
  }
}

export function updateBallCordinates() {
  BALL_Y += BALL_Y_SPEED;
  BALL_X += BALL_X_SPEED;
}

export function drawRectangle(
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  canvas.fillStyle = color;
  canvas.fillRect(x, y, width, height);
}
