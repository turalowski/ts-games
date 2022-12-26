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
        height={600}
        width={800}
        className={styles.canvas}
      ></canvas>
    </div>
  );
}
