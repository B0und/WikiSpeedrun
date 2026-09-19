import { useEffect, useState } from "react";
import { expect } from "vitest";
import { renderWithI18n, testWithMSW } from "../test-extend";
import { StopwatchContextProvider, useStopwatchActions } from "./StopwatchContext";

const delay = (ms: number) => {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, ms);
  return promise;
};

// Buttons drive the stopwatch through real events so the callbacks under test
// are the memoized context actions, not test-local handles.
const Controls = () => {
  const { startStopwatch, pauseStopwatch, getFormattedTime } = useStopwatchActions();
  const [captured, setCaptured] = useState("");
  return (
    <>
      <button type="button" onClick={startStopwatch}>
        start
      </button>
      <button type="button" onClick={pauseStopwatch}>
        pause
      </button>
      <button type="button" onClick={() => setCaptured(getFormattedTime().ms)}>
        capture
      </button>
      <output>{captured}</output>
    </>
  );
};

// Regression: getFormattedTime depended on per-frame stopwatch state, so the
// memoized actions context changed identity every animation frame and
// re-rendered every useStopwatchActions consumer (the whole shadow-DOM article
// subtree) each frame while the stopwatch ran.
testWithMSW("stopwatch actions stay referentially stable across frames", async () => {
  // Recorded in an effect: one entry per distinct actions identity seen by a
  // consumer (the effect fires on every commit, including context churn).
  const seenActions: unknown[] = [];
  const Counter = () => {
    const actions = useStopwatchActions();
    useEffect(() => {
      if (seenActions[seenActions.length - 1] !== actions) seenActions.push(actions);
    });
    return <span data-testid="render-counter" />;
  };

  const screen = await renderWithI18n(
    <StopwatchContextProvider>
      <Controls />
      <Counter />
    </StopwatchContextProvider>,
  );

  await screen.getByRole("button", { name: "start" }).click();
  await expect.element(screen.getByRole("button", { name: "pause" })).toBeVisible();

  // A single identity: even the start state change must not churn the memoized
  // actions object, and running animation frames must not add any more.
  await delay(200);
  expect(seenActions.length, `${seenActions.length} distinct action identities seen`).toBe(1);

  // While running, capture at two different instants: the value context must
  // keep ticking without re-rendering the actions consumer.
  await screen.getByRole("button", { name: "capture" }).click();
  const firstCapture = document.querySelector("output")?.textContent;
  await delay(150);
  await screen.getByRole("button", { name: "capture" }).click();
  const secondCapture = document.querySelector("output")?.textContent;
  expect(firstCapture).not.toBe("");
  expect(secondCapture, "getFormattedTime must read the live lapse at call time").not.toBe(
    firstCapture,
  );

  // After pausing the lapse freezes (the stable callback still reads fresh
  // refs, including the state set by pause itself).
  await screen.getByRole("button", { name: "pause" }).click();
  await screen.getByRole("button", { name: "capture" }).click();
  const pausedCapture = document.querySelector("output")?.textContent;
  await delay(150);
  await screen.getByRole("button", { name: "capture" }).click();
  expect(document.querySelector("output")?.textContent).toBe(pausedCapture);
});
