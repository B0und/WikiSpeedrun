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

const SHOW_CONFETTI_DEBUG_PANEL = false;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (import.meta.env.MODE === "development" && SHOW_CONFETTI_DEBUG_PANEL) {
  void import("tweakpane").then((TweakpaneModule) => {
    const pane = new TweakpaneModule.Pane();

    const addFolderWithExport = (title: string, options: Options) => {
      const folder = pane.addFolder({
        title: title,
        expanded: false,
      });

      // Dynamically add bindings for each property in the options
      for (const [key, value] of Object.entries(options)) {
        if (["colors", "shapes"].includes(key)) {
          continue;
        }
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
            step: value > 1 ? 0.1 : 0.01,
          });
        } else {
          folder.addBinding(options, key as keyof Options);
        }
      }

      // Add Export Button
      const exportBtn = folder.addButton({ title: "Copy to clipboard" });
      exportBtn.on("click", () => {
        void navigator.clipboard.writeText(JSON.stringify(options, null, 2));
      });
    };

    // Add folders with specific settings
    addFolderWithExport("Realistic2", middle1);
    addFolderWithExport("Realistic3", middle2);
    addFolderWithExport("Common corner settings", commonCornerExplosionOpts);
    addFolderWithExport("corner1", corner1);
    addFolderWithExport("corner2", corner2);
    addFolderWithExport("corner3", corner3);
    addFolderWithExport("corner4", corner4);
  }); // <-- Properly close the `.then()` block here
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
