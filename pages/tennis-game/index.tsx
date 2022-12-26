import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../utils/tennis-game';
import { tennisGame } from '../../hooks/tennis-game';
import styles from '../../styles/Tennis.module.css';
export default function Home() {
  const [canvasRef] = tennisGame();
  return (
    <div className={styles.Tennis}>
      <h1 className={styles.title}>Tennis game</h1>
      <canvas
        id="tennis-game"
        ref={canvasRef}
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        className={styles.canvas}
      ></canvas>
    </div>
  );
}
