import { expect, test } from "vitest";
import { isCheatShortcut } from "./Wiki.utils";

test("Ctrl+F is detected regardless of Caps Lock", () => {
  expect(isCheatShortcut({ key: "f", ctrlKey: true })).toBe(true);
  expect(isCheatShortcut({ key: "F", ctrlKey: true })).toBe(true);
});

test("F3 is detected and plain keys are not", () => {
  expect(isCheatShortcut({ key: "F3", ctrlKey: false })).toBe(true);
  expect(isCheatShortcut({ key: "f", ctrlKey: false })).toBe(false);
  expect(isCheatShortcut({ key: "Enter", ctrlKey: true })).toBe(false);
});
