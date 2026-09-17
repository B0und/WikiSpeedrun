import { HttpResponse, http } from "msw";

import ChahkandukBirjand from "./wiki_pages/ChahkandukBirjand.json";

// https://en.wikipedia.org/w/api.php?page=Chahkanduk%2C+Birjand&origin=*&action=parse&format=json&disableeditsection=true&redirects=true

const getArticlePage = (article: string) =>
  `?page=${encodeURI(article)}&origin=*&action=parse&format=json&disableeditsection=true&redirects=true`;

export const handlers = [
  http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
    const url = new URL(request.url);

    if (url.search === getArticlePage("Chahkanduk, Birjand")) {
      return new HttpResponse(ChahkandukBirjand);
    }
    // Returning undefined lets MSW treat the request as unhandled.
    return undefined;
  }),
];
