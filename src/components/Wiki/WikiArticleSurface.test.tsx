import { HttpResponse, http } from "msw";
import { expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { testWithMSW } from "../../test-extend";
import { testWorker } from "../../test_mocks/browser";
import { WikiArticleSurface } from "./WikiArticleSurface";
import type { WikiArticleData } from "./Wiki.types";

const styleUrl =
  "https://en.wikipedia.org/w/load.php?modules=skins.vector.styles&only=styles&skin=vector-2022&lang=en&debug=false";

const article: WikiArticleData = {
  html: '<div class="mw-parser-output"><a href="/wiki/Other">Styled link</a></div>',
  title: "Style Test",
  pageid: 10,
  revid: 20,
  language: "en",
  styleUrls: [styleUrl],
};

testWithMSW("isolates ResourceLoader CSS inside the article shadow root", async () => {
  const onReady = vi.fn();
  const screen = render(
    <WikiArticleSurface
      article={article}
      fontSize="standard"
      isDark={false}
      onReady={onReady}
      onClick={() => undefined}
      onKeyDown={() => undefined}
    />,
  );

  await expect(screen.getByRole("link", { name: "Styled link" })).toBeVisible();
  await expect.poll(() => onReady.mock.calls.length).toBe(1);
  expect(onReady).toHaveBeenCalledWith(expect.any(HTMLElement), "ready");

  const host = document.querySelector<HTMLElement>('[data-testid="wiki-article-host"]');
  const articleLink = host?.shadowRoot?.querySelector("a");
  const articleShell = host?.shadowRoot?.querySelector<HTMLElement>(".wiki-insert");
  expect(articleLink && getComputedStyle(articleLink).color).toBe("rgb(51, 102, 204)");
  expect(articleShell && getComputedStyle(articleShell).color).not.toBe("rgb(255, 0, 0)");
  expect(getComputedStyle(document.body).color).not.toBe("rgb(255, 0, 0)");
});

testWithMSW("shows readable degraded content when ResourceLoader styles fail", async () => {
  testWorker.use(http.get("https://en.wikipedia.org/w/load.php", () => HttpResponse.error()));
  const onReady = vi.fn();
  const degradedArticle = {
    ...article,
    html: '<div class="mw-parser-output"><p>Readable fallback</p></div>',
    pageid: 100,
    revid: 200,
  };

  const screen = render(
    <WikiArticleSurface
      article={degradedArticle}
      fontSize="standard"
      isDark={false}
      onReady={onReady}
      onClick={() => undefined}
      onKeyDown={() => undefined}
    />,
  );

  await expect(screen.getByText("Readable fallback")).toBeVisible();
  await expect.poll(() => onReady.mock.calls.length).toBe(1);
  expect(onReady).toHaveBeenCalledWith(expect.any(HTMLElement), "degraded");
  const host = document.querySelector<HTMLElement>('[data-testid="wiki-article-host"]');
  expect(host?.getAttribute("aria-busy")).toBe("false");
  expect(host?.shadowRoot?.querySelector(".wiki-style-degraded")).not.toBeNull();
});
