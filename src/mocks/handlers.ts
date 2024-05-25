import { http, HttpResponse } from "msw";

const getSelectArticleUrl = (article: string) =>
  `?action=query&list=search&origin=*&format=json&srsearch=${article}`;

export const handlers = [
  http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
    const url = new URL(request.url);
    if (url.search === getSelectArticleUrl("abc")) {
      return HttpResponse.error();
    }
  }),
];
