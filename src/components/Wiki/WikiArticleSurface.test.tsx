import { HttpResponse, http } from "msw";
import { expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { testWithMSW } from "../../test-extend";
import { testWorker } from "../../test_mocks/browser";
import { WikiArticleSurface } from "./WikiArticleSurface";
import { findVisibleWinningLinks, getWikiArticleKey } from "./WikiDisplay.utils";
import type { WikiArticleData, WikiArticleStyleState } from "./Wiki.types";

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
  const screen = await render(
    <WikiArticleSurface
      article={article}
      fontSize="standard"
      isDark={false}
      onReady={onReady}
      onClick={() => undefined}
      onKeyDown={() => undefined}
    />,
  );

  await expect.element(screen.getByRole("link", { name: "Styled link" })).toBeVisible();
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

  const screen = await render(
    <WikiArticleSurface
      article={degradedArticle}
      fontSize="standard"
      isDark={false}
      onReady={onReady}
      onClick={() => undefined}
      onKeyDown={() => undefined}
    />,
  );

  await expect.element(screen.getByText("Readable fallback")).toBeVisible();
  await expect.poll(() => onReady.mock.calls.length).toBe(1);
  expect(onReady).toHaveBeenCalledWith(expect.any(HTMLElement), "degraded");
  const host = document.querySelector<HTMLElement>('[data-testid="wiki-article-host"]');
  expect(host?.getAttribute("aria-busy")).toBe("false");
  expect(host?.shadowRoot?.querySelector(".wiki-style-degraded")).not.toBeNull();
});

testWithMSW("applies all article font sizes through Vector custom properties", async () => {
  const onReady = vi.fn();
  const fontSizes = ["small", "standard", "large"] as const;
  await render(
    <div>
      {fontSizes.map((fontSize, index) => (
        <WikiArticleSurface
          key={fontSize}
          article={{ ...article, pageid: index + 1 }}
          fontSize={fontSize}
          isDark={false}
          onReady={onReady}
          onClick={() => undefined}
          onKeyDown={() => undefined}
        />
      ))}
    </div>,
  );

  await expect.poll(() => onReady.mock.calls.length).toBe(3);
  const computedTypography = Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid="wiki-article-host"]'),
    (host) => {
      const body = host.shadowRoot?.querySelector<HTMLElement>(".vector-body");
      return body ? [getComputedStyle(body).fontSize, getComputedStyle(body).lineHeight] : [];
    },
  );

  expect(computedTypography).toEqual([
    ["14px", "22px"],
    ["16px", "26px"],
    ["20px", "31px"],
  ]);
});

testWithMSW("reports readiness only after the final cascade hides winning links", async () => {
  testWorker.use(
    http.get("https://en.wikipedia.org/w/load.php", () =>
      HttpResponse.text(".mw-parser-output a.hidden-link { display: none; }", {
        headers: { "Content-Type": "text/css; charset=utf-8" },
      }),
    ),
  );
  const onReady = vi.fn<(contentRoot: HTMLElement, state: WikiArticleStyleState) => void>();

  await render(
    <WikiArticleSurface
      article={{
        html: '<div class="mw-parser-output"><a class="hidden-link" href="/wiki/Winning_Article">Winning article</a><a href="/wiki/Visible_Article">Visible article</a></div>',
        title: "Cascade Test",
        pageid: 30,
        revid: 40,
        language: "en",
        styleUrls: [styleUrl],
      }}
      fontSize="standard"
      isDark={false}
      onReady={onReady}
      onClick={() => undefined}
      onKeyDown={() => undefined}
    />,
  );

  await expect.poll(() => onReady.mock.calls.length).toBe(1);
  const [contentRoot] = onReady.mock.calls[0] ?? [];
  const hiddenLink = contentRoot?.querySelector("a.hidden-link");

  expect(hiddenLink && getComputedStyle(hiddenLink).display).toBe("none");
  expect(
    contentRoot && findVisibleWinningLinks(contentRoot, { pageid: "9", title: "Winning Article" }),
  ).toEqual([]);
});

testWithMSW(
  "settles the replacement article while the previous article's styles are pending",
  async () => {
    const slowStyles = Promise.withResolvers<void>();
    testWorker.use(
      http.get("https://en.wikipedia.org/w/load.php", async ({ request }) => {
        if (new URL(request.url).searchParams.get("lang") === "slow") {
          await slowStyles.promise;
        }
        return HttpResponse.text(".mw-parser-output { color: rgb(0, 0, 0); }", {
          headers: { "Content-Type": "text/css; charset=utf-8" },
        });
      }),
    );
    const onReady = vi.fn<(contentRoot: HTMLElement, state: WikiArticleStyleState) => void>();
    const slowArticle: WikiArticleData = {
      html: '<div class="mw-parser-output"><p>Slow article</p></div>',
      title: "Slow article",
      pageid: 50,
      revid: 60,
      language: "en",
      styleUrls: [`${styleUrl}&lang=slow`],
    };
    const fastArticle: WikiArticleData = {
      html: '<div class="mw-parser-output"><p>Fast article</p></div>',
      title: "Fast article",
      pageid: 51,
      revid: 61,
      language: "en",
      styleUrls: [styleUrl],
    };

    const screen = await render(
      <WikiArticleSurface
        key={getWikiArticleKey(slowArticle)}
        article={slowArticle}
        fontSize="standard"
        isDark={false}
        onReady={onReady}
        onClick={() => undefined}
        onKeyDown={() => undefined}
      />,
    );
    await screen.rerender(
      <WikiArticleSurface
        key={getWikiArticleKey(fastArticle)}
        article={fastArticle}
        fontSize="standard"
        isDark={false}
        onReady={onReady}
        onClick={() => undefined}
        onKeyDown={() => undefined}
      />,
    );

    await expect.poll(() => onReady.mock.calls.length).toBe(1);
    const [contentRoot, styleState] = onReady.mock.calls[0] ?? [];
    expect(styleState).toBe("ready");
    expect(contentRoot?.textContent).toContain("Fast article");

    slowStyles.resolve();
    const settleDelay = Promise.withResolvers<void>();
    setTimeout(settleDelay.resolve, 100);
    await settleDelay.promise;
    expect(onReady).toHaveBeenCalledTimes(1);
  },
);
