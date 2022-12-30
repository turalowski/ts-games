import { useState, useRef, useEffect } from 'react';
import {
  initialBallState,
  initialPaddleLeft,
  initialPaddleRight,
  initialGameState,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  FPS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WINNING_SCORE,
} from '../utils/constants';
export function tennisGame() {
  const [game, setGame] = useState(initialGameState);
  const [ball, setBall] = useState(initialBallState);
  const [paddleLeft, setPaddleLeft] = useState(initialPaddleLeft);
  const [paddleRight, setPaddleRight] = useState(initialPaddleRight);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function moveComputerPaddle() {
    console.log(paddleRight);
    if (ball.y < paddleRight.y) {
      setPaddleRight(prevPaddleRight => ({
        ...prevPaddleRight,
        y: ball.y - 10,
      }));
    }
    if (ball.y > paddleRight.y + PADDLE_HEIGHT) {
      setPaddleRight(prevPaddleRight => ({
        ...prevPaddleRight,
        y: ball.y + 10,
      }));
    }
  }

  function resetBall() {
    setBall(initialBallState);
  }

  function checkCornersAndUpdateSpeed() {
    // right
    if (ball.x + ball.radius * 2 > CANVAS_WIDTH) {
      if (ball.y > paddleRight.y && ball.y < paddleRight.y + PADDLE_HEIGHT) {
        setBall(prevBall => ({
          ...prevBall,
          x_speed: prevBall.x_speed * -1,
        }));
      } else {
        resetBall();
        setGame(prevGame => ({
          ...prevGame,
          left: prevGame.left + 1,
        }));
        game.left += 1;
      }
    }
    // left
    if (ball.x - PADDLE_WIDTH <= 0) {
      if (ball.y > paddleLeft.y && ball.y < paddleLeft.y + PADDLE_HEIGHT) {
        setBall(prevBall => ({
          ...prevBall,
          x_speed: prevBall.x_speed * -1,
        }));
        if (ball.x < paddleLeft.y / 2) {
          setBall(prevBall => ({
            ...prevBall,
            y_speed: prevBall.y_speed * -1,
          }));
        } else if (ball.x > paddleLeft.y) {
          setBall(prevBall => ({
            ...prevBall,
            y_speed: prevBall.y_speed * -1,
          }));
        } else {
          // Do nothing
        }
      } else {
        resetBall();
        game.right += 1;
      }
    }
    // top
    if (ball.y < 0) {
      ball.y_speed *= -1;
    }
    // bottom
    if (ball.y > CANVAS_HEIGHT) {
      ball.y_speed *= -1;
    }
  }

  function updateBallCordinates() {
    setBall(prevBall => {
      return {
        ...prevBall,
        x: prevBall.x + prevBall.x_speed,
        y: prevBall.y + prevBall.y_speed,
      };
    });
  }

  function drawRectangle(
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
  function calculateMousePosition(event: MouseEvent) {
    if (!canvasRef.current) {
      return;
    }
    const rectangle = canvasRef.current?.getBoundingClientRect();

    const mouseX =
      event.clientX - rectangle.left - document.documentElement.scrollLeft;

    const mouseY =
      event.clientY - rectangle.top - document.documentElement.scrollTop;
    return { x: mouseX, y: mouseY };
  }

  function moveEverything() {}

  function drawEverything() {
    const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
      '2d'
    );
    if (canvasContext) {
      // Draw the canvas
      drawRectangle(canvasContext, 0, 0, 800, 600, 'black');
      // Draw the left paddle
      drawRectangle(
        canvasContext,
        paddleLeft.x,
        paddleLeft.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'white'
      );
      // Draw the right paddle
      drawRectangle(
        canvasContext,
        paddleRight.x,
        paddleRight.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'white'
      );
      // Draw the ball
      canvasContext.fillStyle = 'white';
      canvasContext.beginPath();
      canvasContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
      canvasContext.fill();
      canvasContext.font = '15px Arial';
      canvasContext.textAlign = 'center';
      canvasContext.fillText(`Score: ${game.left} - ${game.right}`, 400, 50);
    }
  }
  function checkResult() {
    const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
      '2d'
    );
    if (canvasContext) {
      if (game.left === WINNING_SCORE || game.right === WINNING_SCORE) {
        canvasContext.font = '15px Arial';
        canvasContext.textAlign = 'center';
        canvasContext.fillText(
          `Game OVER: ${game.left} - ${game.right} \n Press Space to play again`,
          400,
          300
        );
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  }

  function resetGame() {
    setGame(initialGameState);
    setBall(initialBallState);
    setPaddleLeft(initialPaddleLeft);
    setPaddleRight(initialPaddleRight);

    intervalRef.current = setInterval(function () {
      moveEverything();
      drawEverything();
      checkResult();
    }, 1000 / FPS);
  }

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    canvasRef.current?.addEventListener('mousemove', function (event) {
      const mousePosition = calculateMousePosition(event);
      if (mousePosition !== undefined) {
        if (
          mousePosition.y >= PADDLE_HEIGHT / 2 &&
          mousePosition.y <= CANVAS_HEIGHT - PADDLE_HEIGHT / 2
        ) {
          setPaddleLeft(prevPaddleLeft => ({
            ...prevPaddleLeft,
            y: mousePosition.y - PADDLE_HEIGHT / 2,
          }));
        }
        // PADDLE2_Y = mousePosition.y - PADDLE_HEIGHT;
      }
    });

    window.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
        resetGame();
      }
    });
    intervalRef.current = setInterval(function () {
      updateBallCordinates();
    }, 1000 / FPS);
  }, []);
  useEffect(() => {
    checkCornersAndUpdateSpeed();
    moveComputerPaddle();
  }, [ball]);

  useEffect(() => {
    drawEverything();
    checkResult();
  }, [ball, paddleLeft, paddleRight]);

  return [canvasRef];
}
