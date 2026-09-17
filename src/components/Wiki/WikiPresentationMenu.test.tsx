import { userEvent } from "@vitest/browser/context";
import { expect } from "vitest";
import { customRender, testWithMSW } from "../../test-extend";
import { router } from "../AppProviders";

testWithMSW("updates and retains the live article presentation", async () => {
  const screen = customRender();
  await expect.poll(() => document.querySelector('a[href="/settings"]')?.textContent).toBe("Play");
  await router.navigate({
    to: "/wiki/$",
    params: { _splat: "Chahkanduk, Birjand" },
    search: {
      state: {
        history: [{ title: "Chahkanduk, Birjand", time: { min: "00", sec: "00", ms: "000" }, winningLinks: 0 }],
        startingArticle: { pageid: "35769150", title: "Chahkanduk, Birjand" },
        endingArticle: { pageid: "42510803", title: "2014 BRD Năstase Țiriac Trophy – Doubles" },
      },
    },
  });

  await expect
    .poll(() => document.querySelector("[data-wiki-article-width]")?.getAttribute("data-wiki-article-width"))
    .toBe("standard");
  const appearanceTrigger = screen.getByRole("button", { name: "Article appearance" });
  await appearanceTrigger.click();

  const largeFont = screen.getByText("Large");
  const compactWidth = screen.getByText("Compact");
  const wideWidth = screen.getByText("Wide");
  await compactWidth.click();

  const articleColumn = document.querySelector<HTMLElement>("[data-wiki-article-width]");
  const host = document.querySelector<HTMLElement>('[data-testid="wiki-article-host"]');
  const articleBody = host?.shadowRoot?.querySelector<HTMLElement>(".vector-body");
  expect(articleColumn && getComputedStyle(articleColumn).maxWidth).toBe("948px");
  expect(articleColumn?.getBoundingClientRect().width).toBeLessThanOrEqual(948);

  await largeFont.click();
  await expect.poll(() => (articleBody ? getComputedStyle(articleBody).fontSize : null)).toBe("20px");

  await userEvent.keyboard("{ArrowLeft}");
  await expect.poll(() => (articleBody ? getComputedStyle(articleBody).fontSize : null)).toBe("16px");

  await wideWidth.click();
  await expect.poll(() => (articleColumn ? getComputedStyle(articleColumn).maxWidth : null)).toBe("none");
  expect(articleColumn?.getBoundingClientRect().width).toBeGreaterThan(948);

  await appearanceTrigger.click();
  await appearanceTrigger.click();
  await expect(screen.getByRole("radio", { name: "Standard" })).toBeChecked();
  await expect(screen.getByRole("radio", { name: "Wide" })).toBeChecked();

  await screen.getByText("Compact").click();
});
