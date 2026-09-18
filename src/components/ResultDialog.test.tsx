import { userEvent } from "vitest/browser";
import type { RenderResult } from "vitest-browser-react";
import { expect } from "vitest";
import { customRender, testWithMSW } from "../test-extend";
import { useGameStore } from "../stores/GameStore";
import { ResultDialog } from "./ResultDialog";

const WIN_HISTORY = [
  { title: "Start article", time: { min: "00", sec: "12", ms: "345" }, winningLinks: 3 },
  { title: "Target article", time: { min: "00", sec: "12", ms: "345" }, winningLinks: 0 },
];

const seedWin = () => {
  useGameStore.setState({
    isWin: true,
    winCount: 1,
    history: WIN_HISTORY,
    startingArticle: { pageid: "1", title: "Start article" },
    endingArticle: { pageid: "2", title: "Target article" },
  });
};

const dialog = (screen: RenderResult) => screen.getByRole("dialog");

testWithMSW("results dialog reopens from the trigger after being dismissed", async () => {
  seedWin();
  const screen = await customRender(<ResultDialog />);

  // The win auto-opens the dialog.
  await expect.element(dialog(screen)).toBeVisible();

  // Dismissing (Escape) must not make the dialog unreachable...
  await userEvent.keyboard("{Escape}");
  await expect.element(dialog(screen)).not.toBeInTheDocument();

  // ...the Results trigger must reopen it for the current win.
  await screen.getByRole("button", { name: "Results" }).click();
  await expect.element(dialog(screen)).toBeVisible();
});

testWithMSW("a dismissed win does not suppress the next win's dialog", async () => {
  seedWin();
  const screen = await customRender(<ResultDialog />);

  await expect.element(dialog(screen)).toBeVisible();
  await userEvent.keyboard("{Escape}");
  await expect.element(dialog(screen)).not.toBeInTheDocument();

  // Play again and win a second game: the auto-open (and confetti) must come
  // back. winCount is the unique win identity; history.length is not — two
  // different games can end with the same number of history entries.
  useGameStore.getState().actions.resetStoreState();
  useGameStore.getState().actions.setIsWin(true);
  useGameStore.setState({ history: WIN_HISTORY });

  await expect.element(dialog(screen)).toBeVisible();
});
