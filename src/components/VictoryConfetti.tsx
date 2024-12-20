import { useEffect, useRef } from "react";
import { CreateTypes, Options, create } from "canvas-confetti";

import { Pane } from "tweakpane";

// 50 107 190

const pane = new Pane();
function addFolderWithExport(title: string, options: Options) {
  const folder = pane.addFolder({
    title: title,
    expanded: true,
  });

  // Dynamically add bindings for each property in the options
  for (const [key, value] of Object.entries(options)) {
    if (key === "origin") {
      folder.addBinding(options, key as keyof Options, {
        x: { min: -0.5, max: 1 },
        y: { min: -0.5, max: 1, inverted: true },
      });
      continue;
    }

    if (typeof value === "number") {
      folder.addBinding(options, key as keyof Options, {
        min: value > 1 ? 1 : 0,
        max: value > 1 ? 500 : 1,
        step: value > 1 ? 1 : 0.1,
      });
    } else {
      folder.addBinding(options, key as keyof Options);
    }
  }

  // Add Export Button
  const exportBtn = folder.addButton({ title: "Export" });
  exportBtn.on("click", () => {
    void navigator.clipboard.writeText(JSON.stringify(options, null, 2));
  });
}

const realisticOpts1: Options = {
  origin: { y: 0.7, x: 0.5 },
  particleCount: 50,
  scalar: 1,
  spread: 26,
  startVelocity: 55,
  decay: 0.9,
};
addFolderWithExport("Realistic1", realisticOpts1);

const realisticOpts2: Options = {
  origin: { y: 0.7, x: 0.5 },
  particleCount: Math.floor(200 * 0.35),
  scalar: 0.8,
  spread: 100,
  startVelocity: 45,
  decay: 0.91,
};
addFolderWithExport("Realistic2", realisticOpts2);

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export const VictoryConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confetti = useRef<CreateTypes | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const confettiInstance = create(canvasRef.current, {});
    confetti.current = confettiInstance;

    const fire = (opts: Options) => {
      void confettiInstance({
        ...opts,
      });
    };

    // Realistic middle explosion
    fire(realisticOpts1);

    // fire({
    //   spread: 60,
    //   origin: { y: 0.7 },
    //   particleCount: Math.floor(200 * 0.2),
    // });

    // fire({
    //   spread: 100,
    //   decay: 0.91,
    //   scalar: 0.8,
    //   origin: { y: 0.7 },
    //   particleCount: Math.floor(200 * 0.35),
    // });

    // fire({
    //   spread: 120,
    //   startVelocity: 25,
    //   decay: 0.92,
    //   scalar: 1.2,
    //   origin: { y: 0.7 },
    //   particleCount: Math.floor(200 * 0.1),
    // });

    // fire({
    //   spread: 120,
    //   startVelocity: 45,
    //   origin: { y: 0.7 },
    //   particleCount: Math.floor(200 * 0.1),
    // });

    // // Corner explosions
    // const commonCornerExplosionOpts: Options = {
    //   gravity: 0,
    //   colors: ["#E8B837"],
    //   particleCount: randomInRange(100, 100),
    //   spread: randomInRange(75, 85),
    //   decay: randomInRange(0.97, 0.99),
    //   // startVelocity: randomInRange(6, 6),
    //   // ticks: randomInRange(40, 60),
    // };

    // fire({
    //   ...commonCornerExplosionOpts,
    //   angle: 45,
    //   origin: { x: 0, y: 1 },
    // });

    // fire({
    //   ...commonCornerExplosionOpts,
    //   angle: -45,
    //   origin: { x: 0, y: 0 },
    // });

    // fire({
    //   ...commonCornerExplosionOpts,
    //   angle: -135,
    //   origin: { x: 1, y: 0 },
    // });

    // fire({
    //   ...commonCornerExplosionOpts,
    //   angle: 135,
    //   origin: { x: 1, y: 1 },
    // });

    return () => {
      confetti.current?.reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={"pointer-events-none fixed left-0 top-0 h-full w-full"}
      width={1600}
      height={1600}
    />
  );
};
