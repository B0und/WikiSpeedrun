import { useEffect } from "react";
import type { Article } from "../stores/GameStore";
import { useSettingsStoreActions } from "../stores/SettingsStore";
import { errorToast } from "../utils/toast";
import type { WikiRandom } from "./RandomButton/RandomButton.types";
import { isSupportedWikiLanguage } from "./Wiki/WikiStyles";
import type { WikiLanguage } from "./Wiki/Wiki.types";

export const getHighestLinksPage = (data: WikiRandom) => {
  if (!data.query?.pages) {
    return undefined;
  }
  const pagesWithLinks = Object.values(data.query.pages).filter((page) =>
    Object.hasOwn(page, "linkshere"),
  );
  if (pagesWithLinks.length === 0) {
    return undefined;
  }
  const highestLinksPage = pagesWithLinks.reduce((prev, current) => {
    const previousLinksphere = prev.linkshere ?? [];
    const currentLinksphere = current.linkshere ?? [];
    return previousLinksphere.length > currentLinksphere.length ? prev : current;
  });

  const title = highestLinksPage.title;
  const pageid = highestLinksPage.pageid;
  return { title, pageid };
};

export const getNHighestLinksPages = (data: WikiRandom, limit = 5) => {
  if (!data.query?.pages) {
    return undefined;
  }

  let linkPages = Object.values(data.query.pages)
    .filter((page) => Object.hasOwn(page, "linkshere"))
    .toSorted((a, b) => (b.linkshere?.length ?? 0) - (a.linkshere?.length ?? 0))
    .slice(0, limit)
    .map((p) => ({ title: p.title, pageid: String(p.pageid) }))
    .filter((v, i, a) => a.findIndex((v2) => v2.pageid === v.pageid) === i); // remove duplicate objects
  const selectedArticleTitles = new Set(linkPages.map((p) => p.title));

  // since some pages can have linksphere missing, we can end up with less articles than intended
  if (linkPages.length < limit) {
    const otherArticles = Object.values(data.query.pages)
      .filter((p) => !selectedArticleTitles.has(p.title))
      .slice(0, limit - linkPages.length)
      .map((p) => ({ title: p.title, pageid: String(p.pageid) }));
    linkPages = linkPages.concat(otherArticles);
  }
  return linkPages;
};

interface RandomSuccessProps {
  setArticle: (article: Article) => void;
  data: WikiRandom;
  failText: string;
}

export const handleOnRandomSuccess = ({ setArticle, data, failText }: RandomSuccessProps) => {
  const articleWithLinks = getHighestLinksPage(data);
  if (!articleWithLinks?.title || articleWithLinks.title.includes("(disambiguation)")) {
    errorToast(failText);
    return;
  }
  setArticle({
    title: articleWithLinks.title,
    pageid: String(articleWithLinks.pageid) || "",
  });
};

export const resolveWikiLanguageFromSearch = (search: string): WikiLanguage | undefined => {
  // Shared settings links carry ?lang=; only languages with a catalog and
  // style support may reach the store (buildWikipediaStyleUrls throws on any
  // other value).
  const language = new URLSearchParams(search).get("lang");
  return language && isSupportedWikiLanguage(language) ? language : undefined;
};

export const useSyncWikiLanguageFromUrl = () => {
  const { setWikiLanguage } = useSettingsStoreActions();
  useEffect(() => {
    const language = resolveWikiLanguageFromSearch(window.location.search);
    if (language) {
      setWikiLanguage(language);
    }
  }, [setWikiLanguage]);
};
