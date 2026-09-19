import { HttpResponse, http, passthrough } from "msw";

const gameArticles = [
  {
    pageid: 5323,
    title: "Computer science",
    html: '<p>Computer science studies computation and information.</p><p>One field is <a href="/wiki/Artificial_intelligence" title="Artificial intelligence">Artificial intelligence</a>.</p>',
  },
  {
    pageid: 1164,
    title: "Artificial intelligence",
    html: '<p>Artificial intelligence enables machines to perform intelligent tasks.</p><p>A major approach is <a href="/wiki/Machine_learning" title="Machine learning">Machine learning</a>.</p>',
  },
  {
    pageid: 233488,
    title: "Machine learning",
    html: '<p>Machine learning develops algorithms that learn from data.</p><p>One branch is <a href="/wiki/Deep_learning" title="Deep learning">Deep learning</a>.</p>',
  },
  {
    pageid: 32472154,
    title: "Deep learning",
    html: "<p>Deep learning uses multilayer neural networks.</p>",
  },
] as const;

const normalizeTitle = (title: string) => title.toLowerCase().replaceAll("_", " ");
const findGameArticle = (title: string) =>
  gameArticles.find((article) => normalizeTitle(article.title) === normalizeTitle(title));

const getSelectArticleUrl = (article: string) =>
  `?action=query&list=search&origin=*&format=json&srsearch=${article}`;

export const handlers = [
  http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
    const url = new URL(request.url);

    if (url.search === getSelectArticleUrl("abc")) {
      return HttpResponse.error();
    }

    const searchedTitle = url.searchParams.get("srsearch");
    if (url.searchParams.get("list") === "search" && searchedTitle) {
      const article = findGameArticle(searchedTitle);
      if (article) {
        return HttpResponse.json({
          query: { search: [{ pageid: article.pageid, title: article.title }] },
        });
      }
    }

    const parsedTitle = url.searchParams.get("page");
    if (url.searchParams.get("action") === "parse" && parsedTitle) {
      const article = findGameArticle(parsedTitle);
      if (article) {
        return HttpResponse.json({
          parse: {
            pageid: article.pageid,
            revid: article.pageid + 1,
            title: article.title,
            text: { "*": article.html },
          },
        });
      }
    }

    const previewPageId = url.searchParams.get("pageids");
    if (previewPageId) {
      const article = gameArticles.find(({ pageid }) => String(pageid) === previewPageId);
      if (article) {
        return HttpResponse.json({
          query: {
            pages: {
              [previewPageId]: {
                pageid: article.pageid,
                title: article.title,
                extract: article.title,
              },
            },
          },
        });
      }
    }

    return passthrough();
  }),
  http.get("https://en.wikipedia.org/w/load.php", () =>
    HttpResponse.text(".mw-parser-output a { color: rgb(51, 102, 204); }", {
      headers: { "Content-Type": "text/css; charset=utf-8" },
    }),
  ),
];
