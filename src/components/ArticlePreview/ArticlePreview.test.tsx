import { HttpResponse, http } from "msw";
import { expect } from "vitest";
import { userEvent } from "vitest/browser";
import { customRender, testWithMSW } from "../../test-extend";
import { testWorker } from "../../test_mocks/browser";
import { router } from "../AppProviders";

// Ten random candidates; pages with more incoming links rank higher, so the
// single random pick is page 1001 and the five-article modal lists 1001-1005.
const RANDOM_PAGES = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010].map(
  (pageid, index) => ({
    pageid,
    title: `Random Article ${pageid}`,
    linkshere: Array.from({ length: 10 - index }, (_, linkIndex) => ({ pageid: linkIndex + 1 })),
  }),
);

const wikiApiHandler = http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("generator") === "random") {
    return HttpResponse.json({
      query: {
        pages: Object.fromEntries(RANDOM_PAGES.map((page) => [String(page.pageid), page])),
      },
    });
  }

  const pageid = url.searchParams.get("pageids") ?? "";
  return HttpResponse.json({
    query: {
      pages: {
        [pageid]: {
          pageid: Number(pageid),
          title: `Random Article ${pageid}`,
          extract: `Summary for article ${pageid}.`,
        },
      },
    },
  });
});

testWithMSW("previews random articles from the settings form and the random modal", async () => {
  testWorker.use(wikiApiHandler);

  const screen = await customRender();
  await router.navigate({ to: "/settings" });

  const startArticleSection = screen.getByTestId("startArticle");

  // Single random article: it becomes the selected starting article, which
  // enables its preview; the popover must show that article's summary.
  await startArticleSection.getByTestId("random-article-1").click();
  await startArticleSection.getByTestId("article-preview").click();
  await expect.element(screen.getByTestId("article-preview-popover")).toBeVisible();
  await expect.element(screen.getByText("Summary for article 1001.")).toBeVisible();
  await userEvent.keyboard("{Escape}");
  await expect.element(screen.getByTestId("article-preview-popover")).not.toBeInTheDocument();

  // Five random articles: the modal rows must offer their own working previews.
  await startArticleSection.getByTestId("random-article-5").click();
  const modal = screen.getByTestId("random-article-modal");
  await expect.element(modal).toBeVisible();

  await modal.getByTestId("article-preview").nth(1).click();
  await expect.element(screen.getByText("Summary for article 1002.")).toBeVisible();

  // The popover above the modal must also be dismissable without closing it.
  await screen.getByTestId("article-preview-close").click();
  await expect.element(screen.getByTestId("article-preview-popover")).not.toBeInTheDocument();
  await expect.element(modal).toBeVisible();
});
