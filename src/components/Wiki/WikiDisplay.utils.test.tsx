import { HttpResponse, http } from "msw";
import { expect } from "vitest";
import { testWithMSW } from "../../test-extend";
import { testWorker } from "../../test_mocks/browser";
import {
  buildWikipediaStyleUrls,
  findVisibleWinningLinks,
  getArticleData,
} from "./WikiDisplay.utils";

testWithMSW("requests the Vector 2022 parse contract", async () => {
  let requestUrl: URL | undefined;
  testWorker.use(
    http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
      requestUrl = new URL(request.url);
      return HttpResponse.json({
        parse: {
          title: "Example",
          pageid: 42,
          revid: 84,
          text: { "*": '<div class="mw-parser-output">Article</div>' },
          modulestyles: ["ext.math.styles"],
        },
      });
    }),
  );

  const article = await getArticleData("en", "Example");

  expect(Object.fromEntries(requestUrl?.searchParams ?? [])).toEqual({
    action: "parse",
    page: "Example",
    prop: "text|displaytitle|revid|modules|jsconfigvars",
    useskin: "vector-2022",
    usearticle: "1",
    origin: "*",
    format: "json",
    disableeditsection: "true",
    redirects: "true",
  });
  expect(article).toMatchObject({
    html: '<div class="mw-parser-output">Article</div>',
    title: "Example",
    pageid: 42,
    revid: 84,
    language: "en",
  });
});

testWithMSW("builds stable isolated ResourceLoader style URLs with legacy layout styles", () => {
  const urls = buildWikipediaStyleUrls("ar", [
    "site.styles",
    "ext.math.styles",
    "skins.vector.styles",
    "ext.cite.styles",
    "ext.math.styles",
    "skins.vector.icons",
    "invalid|module",
  ]).map((value) => new URL(value));

  expect(urls).toHaveLength(3);
  expect(urls.map(({ hostname }) => hostname)).toEqual([
    "ar.wikipedia.org",
    "ar.wikipedia.org",
    "ar.wikipedia.org",
  ]);
  expect(urls.map((url) => url.searchParams.get("modules"))).toEqual([
    "ext.cite.parsoid.styles|mediawiki.skinning.content.parsoid|mediawiki.skins.legacy|skins.vector.styles",
    "ext.cite.styles|ext.math.styles",
    "site.styles",
  ]);
  for (const url of urls) {
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      only: "styles",
      skin: "vector-2022",
      lang: "ar",
      debug: "false",
    });
  }
});

testWithMSW("matches absolute Wikipedia links when counting winning links", () => {
  const root = document.createElement("div");
  root.innerHTML = '<a href="https://en.wikipedia.org/wiki/Winning_Article">Winning article</a>';
  const link = root.querySelector("a");
  Object.defineProperty(link, "offsetWidth", { value: 1 });

  expect(findVisibleWinningLinks(root, { pageid: "1", title: "Winning Article" })).toEqual([link]);
});
testWithMSW("rejects unsupported editions and incomplete parse responses", async () => {
  expect(() => buildWikipediaStyleUrls("not-a-wiki", [])).toThrow("Unsupported Wikipedia language");

  testWorker.use(
    http.get("https://en.wikipedia.org/w/api.php", () =>
      HttpResponse.json({ parse: { title: "Incomplete", pageid: 1, revid: 2 } }),
    ),
  );
  await expect(getArticleData("en", "Incomplete")).rejects.toThrow("incomplete parse response");
});
