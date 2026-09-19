import { expect, test } from "vitest";
import { resolveWikiLanguageFromSearch } from "./Settings.helpers";

test("a supported ?lang= value is applied", () => {
  expect(resolveWikiLanguageFromSearch("?lang=de")).toBe("de");
  expect(resolveWikiLanguageFromSearch("?foo=1&lang=ja")).toBe("ja");
});

test("an unsupported ?lang= value is ignored", () => {
  // buildWikipediaStyleUrls throws for unknown languages; an unvalidated value
  // from a shared link used to crash the settings route.
  expect(resolveWikiLanguageFromSearch("?lang=zzz")).toBeUndefined();
  expect(resolveWikiLanguageFromSearch("?lang=")).toBeUndefined();
  expect(resolveWikiLanguageFromSearch("")).toBeUndefined();
});
