import { useRef, useEffect } from 'react';

export function tennisGame() {
  const FPS = 60;
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 800;
  let BALL_X = 50;
  let BALL_Y = 50;
  let BALL_X_SPEED = 4;
  let BALL_Y_SPEED = 4;
  let BALL_RADIUS = 10;
  let PADDLE1_X = 0;
  let PADDLE1_Y = 250;
  let PADDLE_WIDTH = 10;
  let PADDLE_HEIGHT = 100;
  let PADDLE2_X = CANVAS_WIDTH - PADDLE_WIDTH;
  let PADDLE2_Y = 250;
  let LEFT_SCORE = 0;
  let RIGHT_SCORE = 0;
  let WINNING_SCORE = 1;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function moveComputerPaddle() {
    const randomNumber = Math.floor(Math.random() * 10);
    if (randomNumber > 1) {
      if (BALL_Y < PADDLE2_Y && PADDLE2_Y > 0) {
        PADDLE2_Y -= 10;
      } else if (
        BALL_Y > PADDLE2_Y + PADDLE_HEIGHT &&
        PADDLE2_Y < CANVAS_HEIGHT - PADDLE_HEIGHT
      ) {
        PADDLE2_Y += 10;
      }
    }
  }

  function resetBall() {
    BALL_X = 50;
    BALL_Y = 50;
    BALL_X_SPEED = 4;
    BALL_Y_SPEED = 4;
  }

  function checkCornersAndUpdateSpeed() {
    // right
    if (BALL_X + BALL_RADIUS * 2 > CANVAS_WIDTH) {
      if (BALL_Y > PADDLE2_Y && BALL_Y < PADDLE2_Y + PADDLE_HEIGHT) {
        BALL_X_SPEED *= -1;
      } else {
        console.log(BALL_X, BALL_Y);
        resetBall();
        LEFT_SCORE += 1;
      }
    }
    // left
    if (BALL_X - PADDLE_WIDTH <= 0) {
      if (BALL_Y > PADDLE1_Y && BALL_Y < PADDLE1_Y + PADDLE_HEIGHT) {
        BALL_X_SPEED *= -1;
        if (BALL_X < PADDLE1_Y / 2) {
          BALL_Y_SPEED *= -1;
        } else if (BALL_X > PADDLE1_Y) {
          BALL_Y_SPEED *= -1;
        } else {
          // Do nothing
        }
      } else {
        resetBall();
        RIGHT_SCORE += 1;
      }
    }
    // top
    if (BALL_Y < 0) {
      BALL_Y_SPEED *= -1;
    }
    // bottom
    if (BALL_Y > CANVAS_HEIGHT) {
      BALL_Y_SPEED *= -1;
    }
  }

  function updateBallCordinates() {
    BALL_Y += BALL_Y_SPEED;
    BALL_X += BALL_X_SPEED;
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

  function moveEverything() {
    moveComputerPaddle();
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
      drawRectangle(
        canvasContext,
        PADDLE1_X,
        PADDLE1_Y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'white'
      );
      // Draw the right paddle
      drawRectangle(
        canvasContext,
        PADDLE2_X,
        PADDLE2_Y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'white'
      );
      // Draw the ball
      canvasContext.fillStyle = 'white';
      canvasContext.beginPath();
      canvasContext.arc(BALL_X, BALL_Y, BALL_RADIUS, 0, Math.PI * 2, true);
      canvasContext.fill();
      canvasContext.font = '15px Arial';
      canvasContext.textAlign = 'center';
      canvasContext.fillText(`Score: ${LEFT_SCORE} - ${RIGHT_SCORE}`, 400, 50);
    }
  }
  function checkResult() {
    const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
      '2d'
    );
    if (canvasContext) {
      if (LEFT_SCORE === WINNING_SCORE || RIGHT_SCORE === WINNING_SCORE) {
        canvasContext.font = '15px Arial';
        canvasContext.textAlign = 'center';
        canvasContext.fillText(
          `Game OVER: ${LEFT_SCORE} - ${RIGHT_SCORE} \n Press Space to play again`,
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
    BALL_X = 50;
    BALL_Y = 50;
    BALL_X_SPEED = 4;
    BALL_Y_SPEED = 4;
    BALL_RADIUS = 10;
    PADDLE1_X = 0;
    PADDLE1_Y = 250;
    PADDLE_WIDTH = 10;
    PADDLE_HEIGHT = 100;
    PADDLE2_X = CANVAS_WIDTH - PADDLE_WIDTH;
    PADDLE2_Y = 250;
    LEFT_SCORE = 0;
    RIGHT_SCORE = 0;
    WINNING_SCORE = 1;

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
        PADDLE1_Y = mousePosition.y - PADDLE_HEIGHT;
        // PADDLE2_Y = mousePosition.y - PADDLE_HEIGHT;
      }
    });

    window.addEventListener('keydown', function (event) {
      const code = event.key;
      if (event.code === 'Space') {
        resetGame();
        console.log(event);
      }
    });
    intervalRef.current = setInterval(function () {
      moveEverything();
      drawEverything();
      checkResult();
    }, 1000 / FPS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return [canvasRef];
}
