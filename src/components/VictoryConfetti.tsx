import { type CreateTypes, create, type Options } from "canvas-confetti";
import { useEffect, useRef } from "react";

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const middle1: Options = {
  particleCount: 150,
  spread: 120,
  startVelocity: 20,
  gravity: 1.2,
  decay: 0.98,
  scalar: 1,
  origin: {
    x: 0.5,
    y: 0.4,
  },
  shapes: ["circle"],
  colors: ["#EDE574", "#E1F5C4", "#A8E6CF"],
  ticks: 100,
  disableForReducedMotion: true,
};

const middle2: Options = {
  particleCount: 200,
  spread: 360,
  startVelocity: 30,
  gravity: 0.5,
  decay: 0.98,
  scalar: 0.8,
  origin: {
    x: 0.5,
    y: 0.4,
  },
  shapes: ["square", "star"],
  colors: ["#FFD700", "#FFFFFF", "#B0E0E6"],
  ticks: 100,
  disableForReducedMotion: true,
};

const commonCornerExplosionOpts: Options = {
  gravity: 0,
  colors: ["#E8B837"],
  particleCount: randomInRange(100, 100),
  spread: randomInRange(75, 85),
  decay: 0.95,
  startVelocity: 25,
  ticks: 80,
};

const corner1: Options = {
  ...commonCornerExplosionOpts,
  angle: 45,
  origin: { x: 0, y: 1 },
};

const corner2: Options = {
  ...commonCornerExplosionOpts,
  angle: -45,
  origin: { x: 0, y: 0 },
};

const corner3: Options = {
  ...commonCornerExplosionOpts,
  angle: -135,
  origin: { x: 1, y: 0 },
};

const corner4: Options = {
  ...commonCornerExplosionOpts,
  angle: 135,
  origin: { x: 1, y: 1 },
};

export const VictoryConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confetti = useRef<CreateTypes | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const confettiInstance = create(canvasRef.current, {});
    confetti.current = confettiInstance;

    const fire = (opts: Options, delay = 0) => {
      setTimeout(() => {
        void confettiInstance({
          ...opts,
        });
      }, delay);
    };

    //  middle explosion
    fire(middle1, 0);
    fire(middle2, 0);

    // Corner explosions
    fire(corner1, 0);
    fire(corner2, 0);
    fire(corner3, 0);
    fire(corner4, 0);

    return () => {
      confetti.current?.reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={"pointer-events-none fixed top-0 left-0 h-full w-full"}
      width={1600}
      height={1600}
    />
  );
};
