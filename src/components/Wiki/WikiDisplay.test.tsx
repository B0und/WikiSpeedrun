import { HttpResponse, http, passthrough } from "msw";
import { expect, vi } from "vitest";
import { customRender, testWithMSW } from "../../test-extend";
import { testWorker } from "../../test_mocks/browser";
import { router } from "../AppProviders";

//http://localhost:5173/wiki?state=%257B%2522history%2522%253A%255B%257B%2522title%2522%253A%2522Chahkanduk%252C%2520Birjand%2522%252C%2522time%2522%253A%257B%2522min%2522%253A%252200%2522%252C%2522sec%2522%253A%252200%2522%252C%2522ms%2522%253A%2522000%2522%257D%252C%2522winningLinks%2522%253A0%257D%255D%252C%2522startingArticle%2522%253A%257B%2522pageid%2522%253A%252235769150%2522%252C%2522title%2522%253A%2522Chahkanduk%252C%2520Birjand%2522%257D%252C%2522endingArticle%2522%253A%257B%2522pageid%2522%253A%252242510803%2522%252C%2522title%2522%253A%25222014%2520BRD%2520N%25C4%2583stase%2520%25C8%259Airiac%2520Trophy%2520%25E2%2580%2593%2520Doubles%2522%257D%257D
testWithMSW("Show/Hide button works correctly", async () => {
  const screen = await customRender();
  await router.navigate({
    to: `/wiki/$`,
    params: {
      _splat: "Chahkanduk, Birjand",
    },
    search: {
      state: {
        history: [
          {
            title: "Chahkanduk, Birjand",
            time: { min: "00", sec: "00", ms: "000" },
            winningLinks: 0,
          },
        ],
        startingArticle: { pageid: "35769150", title: "Chahkanduk, Birjand" },
        endingArticle: { pageid: "42510803", title: "2014 BRD Năstase Țiriac Trophy – Doubles" },
      },
    },
  });

  const screenSurface = document.querySelector('[data-testid="wiki-article-host"]')?.shadowRoot;
  const collapsedNavbox = screenSurface?.querySelector("table.mw-collapsed");
  expect(collapsedNavbox).not.toBeNull();
  await expect
    .poll(() => {
      const rows = collapsedNavbox?.querySelectorAll("tr:not(:first-child)");
      return rows ? Array.from(rows, (row) => getComputedStyle(row).display) : [];
    })
    .toEqual(
      Array.from(collapsedNavbox?.querySelectorAll("tr:not(:first-child)") ?? [], () => "none"),
    );

  await screen
    .getByRole("columnheader", { name: /Iran Birjand County/ })
    .click({ position: { x: 0, y: 0 } });
  await expect
    .poll(() => {
      const rows = collapsedNavbox?.querySelectorAll("tr:not(:first-child)");
      return rows ? Array.from(rows, (row) => getComputedStyle(row).display) : [];
    })
    .toEqual(
      Array.from(
        collapsedNavbox?.querySelectorAll("tr:not(:first-child)") ?? [],
        () => "table-row",
      ),
    );
  await expect.element(screen.getByText("Alqurat")).toBeVisible();
});

testWithMSW("same-page links scroll to targets in the article root", async () => {
  testWorker.use(
    http.get("https://en.wikipedia.org/w/api.php", () =>
      HttpResponse.json({
        parse: {
          title: "Hash Test",
          pageid: 1,
          revid: 2,
          text: {
            "*": '<div class="mw-parser-output"><a href="#wiki-test-target">Jump</a><p id="wiki-test-target">Target</p><a href="https://en.wikipedia.org/wiki/Target_Article">Next article</a></div>',
          },
        },
      }),
    ),
  );
  const scrolledElementIds: string[] = [];
  vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(function (this: Element) {
    scrolledElementIds.push(this.id);
  });

  const screen = await customRender();
  await router.navigate({
    to: "/wiki/$",
    params: { _splat: "Hash Test" },
    search: {
      state: {
        history: [
          { title: "Hash Test", time: { min: "00", sec: "00", ms: "000" }, winningLinks: 0 },
        ],
        startingArticle: { pageid: "1", title: "Hash Test" },
        endingArticle: { pageid: "3", title: "Other" },
      },
    },
  });

  await screen.getByRole("link", { name: "Jump" }).click();
  expect(scrolledElementIds).toContain("wiki-test-target");

  await screen.getByRole("link", { name: "Next article" }).click();
  await expect.poll(() => router.state.location.pathname).toBe("/wiki/Target_Article");
});

testWithMSW(
  "a failed article request removes the previous article from the screen",
  // TanStack Query retries three times with exponential backoff before it
  // reports the error the article surface reacts to.
  { timeout: 30_000 },
  async () => {
    testWorker.use(
      http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("action") !== "parse") {
          return passthrough();
        }

        const page = url.searchParams.get("page");
        if (page === "Broken_article") {
          return HttpResponse.json({
            error: { code: "missingtitle", info: "The page you specified doesn't exist." },
          });
        }

        return HttpResponse.json({
          parse: {
            pageid: 111,
            revid: 112,
            title: page,
            text: {
              "*": '<div class="mw-parser-output"><a href="/wiki/Broken_article" title="Broken article">Broken article</a></div>',
            },
          },
        });
      }),
    );

    const screen = await customRender();
    await router.navigate({
      to: "/wiki/$",
      params: { _splat: "Working_article" },
      search: {
        state: {
          history: [
            {
              title: "Working article",
              time: { min: "00", sec: "00", ms: "000" },
              winningLinks: 0,
            },
          ],
          startingArticle: { pageid: "111", title: "Working article" },
          endingArticle: { pageid: "999", title: "Never reached" },
        },
      },
    });

    await expect.element(screen.getByRole("link", { name: "Broken article" })).toBeVisible();
    expect(document.querySelector('[data-testid="wiki-article-host"]')).not.toBeNull();

    await screen.getByRole("link", { name: "Broken article" }).click();

    // A failed fetch must not leave the previous article looking live: clicks
    // on it would count against an article that never loaded.
    await expect
      .poll(() => document.querySelector('[data-testid="wiki-article-host"]'), { timeout: 20_000 })
      .toBeNull();
  },
);
