import { useRef, useEffect } from 'react';
import {
  FPS,
  BALL_X,
  BALL_Y,
  checkCornersAndUpdateSpeed,
  updateBallCordinates,
  drawRectangle,
} from '../utils/tennis-game';
export function tennisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function calculateMousePosition(event: MouseEvent) {
    if (!canvasRef.current) {
      return;
    }
    const rectangle = canvasRef.current?.getBoundingClientRect();

    const mouseX =
      event.clientX - rectangle.left - document.documentElement.scrollLeft;

    const mouseY =
      event.clientY - rectangle.top - document.documentElement.scrollTop;
    return { mouseX, mouseY };
  }

  function moveEverything() {
    checkCornersAndUpdateSpeed();
    updateBallCordinates();
  }

  function drawEverything() {
    const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
      '2d'
    );
    if (canvasContext) {
      // Draw the canvas
      drawRectangle(canvasContext, 0, 0, 800, 600, 'black');
      // Draw the left paddle
      drawRectangle(canvasContext, 0, 250, 10, 100, 'white');

      // Draw the ball
      canvasContext.fillStyle = 'white';
      canvasContext.beginPath();
      canvasContext.arc(BALL_X, BALL_Y, 10, 0, Math.PI * 2, true);
      canvasContext.fill();
    }
  }

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    canvasRef.current?.addEventListener('mousemove', function (event) {
      calculateMousePosition(event);
    });
    setInterval(function () {
      moveEverything();
      drawEverything();
    }, 1000 / FPS);
  }, [canvasRef]);

  return [canvasRef];
}
