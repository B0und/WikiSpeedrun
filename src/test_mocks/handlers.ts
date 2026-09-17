import { HttpResponse, http } from "msw";

import ChahkandukBirjand from "./wiki_pages/ChahkandukBirjand.json";

export const handlers = [
  http.get("https://en.wikipedia.org/w/api.php", ({ request }) => {
    const url = new URL(request.url);
    const expectedParams: Record<string, string> = {
      action: "parse",
      page: "Chahkanduk, Birjand",
      prop: "text|displaytitle|revid|modules|jsconfigvars",
      useskin: "vector-2022",
      usearticle: "1",
      origin: "*",
      format: "json",
      disableeditsection: "true",
      redirects: "true",
    };

    if (Object.entries(expectedParams).some(([name, value]) => url.searchParams.get(name) !== value)) {
      return HttpResponse.json({ error: { code: "badrequest", info: "Unexpected parse request" } }, { status: 400 });
    }

    return HttpResponse.json(ChahkandukBirjand);
  }),
  http.get("https://en.wikipedia.org/w/load.php", () =>
    HttpResponse.text(".mw-parser-output a { color: rgb(51, 102, 204); } body { color: rgb(255, 0, 0); }", {
      headers: { "Content-Type": "text/css; charset=utf-8" },
    }),
  ),
];
