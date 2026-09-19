import articleAdaptationsUrl from "./styles/article-adaptations.css?url";
import type { WikiLanguage } from "./Wiki.types";
import { LANGUAGES } from "./wikiLanguages";

const BASELINE_STYLE_MODULES = [
  "skins.vector.styles",
  "mediawiki.skinning.content.parsoid",
  "mediawiki.skins.legacy",
  "ext.cite.parsoid.styles",
] as const;

const EXCLUDED_CONDITIONAL_STYLE_MODULES: Record<string, true> = {
  "skins.vector.styles": true,
  "mediawiki.skinning.content.parsoid": true,
  "mediawiki.skins.legacy": true,
  "ext.cite.parsoid.styles": true,
  "site.styles": true,
  "user.styles": true,
  noscript: true,
  "skins.vector.icons": true,
  "skins.vector.search.codex.styles": true,
};
const RESOURCE_LOADER_MODULE_NAME = /^[A-Za-z0-9_.-]+$/;
const SUPPORTED_WIKI_LANGUAGES: Record<string, true> = Object.fromEntries(
  LANGUAGES.map(({ value }) => [value, true]),
);

export const isSupportedWikiLanguage = (language: string): language is WikiLanguage =>
  Object.hasOwn(SUPPORTED_WIKI_LANGUAGES, language);

const buildResourceLoaderUrl = (language: WikiLanguage, modules: readonly string[]) => {
  const url = new URL(`https://${language}.wikipedia.org/w/load.php`);
  url.search = new URLSearchParams({
    modules: modules.join("|"),
    only: "styles",
    skin: "vector-2022",
    lang: language,
    debug: "false",
  }).toString();
  return url.toString();
};

export const buildWikipediaStyleUrls = (
  language: WikiLanguage,
  moduleStyles: readonly string[] = [],
): readonly string[] => {
  if (!isSupportedWikiLanguage(language)) {
    // The guard narrows `language` to `never`; stringify explicitly so the
    // defense-in-depth branch stays type-safe.
    throw new Error(`Unsupported Wikipedia language: ${String(language)}`);
  }

  const conditionalModules = Array.from(
    new Set(
      moduleStyles.filter(
        (moduleName) =>
          RESOURCE_LOADER_MODULE_NAME.test(moduleName) &&
          !EXCLUDED_CONDITIONAL_STYLE_MODULES[moduleName],
      ),
    ),
  ).toSorted();

  return [
    buildResourceLoaderUrl(language, [...BASELINE_STYLE_MODULES].toSorted()),
    ...(conditionalModules.length > 0
      ? [buildResourceLoaderUrl(language, conditionalModules)]
      : []),
    buildResourceLoaderUrl(language, ["site.styles"]),
  ];
};

export const preloadWikipediaStyles = (language: WikiLanguage): void => {
  if (typeof document === "undefined") return;

  for (const href of [...buildWikipediaStyleUrls(language), articleAdaptationsUrl]) {
    const absoluteHref = new URL(href, document.baseURI).href;
    const alreadyLinked = Array.from(document.head.querySelectorAll<HTMLLinkElement>("link")).some(
      (link) =>
        link.href === absoluteHref &&
        (link.relList.contains("preload") || link.relList.contains("stylesheet")),
    );
    if (alreadyLinked) continue;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = absoluteHref;
    link.dataset.wikiStylePreload = "true";
    document.head.append(link);
  }
};
