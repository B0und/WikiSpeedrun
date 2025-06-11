import { useEffect } from "react";
import { toast } from "react-hot-toast";
import type { Article } from "../stores/GameStore";
import { useSettingsStoreActions } from "../stores/SettingsStore";
import type { WikiRandom } from "./RandomButton/RandomButton.types";

export const getHighestLinksPage = (data: WikiRandom) => {
  if (!data.query?.pages) return;
  const highestLinksPage = Object.values(data.query.pages)
    .filter((page) => Object.hasOwn(page, "linkshere"))
    .reduce((prev, current) => {
      const previousLinksphere = prev.linkshere ?? [];
      const currentLinksphere = current.linkshere ?? [];
      return previousLinksphere.length > currentLinksphere.length ? prev : current;
    });

  const title = highestLinksPage.title;
  const pageid = highestLinksPage.pageid;
  return { title, pageid };
};

export const getNHighestLinksPages = (data: WikiRandom, limit = 5) => {
  if (!data.query?.pages) return;

  let linkPages = Object.values(data.query.pages)
    .filter((page) => Object.hasOwn(page, "linkshere"))
    .sort((a, b) => (b.linkshere?.length ?? 0) - (a.linkshere?.length ?? 0))
    .slice(0, limit)
    .map((p) => ({ title: p.title, pageid: String(p.pageid) }))
    .filter((v, i, a) => a.findIndex((v2) => v2.pageid === v.pageid) === i); // remove duplicate objects
  const selectedArticleTitles = linkPages.map((p) => p.title);

  // since some pages can have linksphere missing, we can end up with less articles than intended
  if (linkPages.length < limit) {
    const otherArticles = Object.values(data.query.pages)
      .filter((p) => !selectedArticleTitles.includes(p.title))
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

const errorToast = (text: string) => toast.error(text, { position: "bottom-center" });

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

export const useSyncWikiLanguageFromUrl = () => {
  const { setWikiLanguage } = useSettingsStoreActions();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLanguage = urlParams.get("lang");
    if (urlLanguage) {
      setWikiLanguage(urlLanguage);
    }
  }, [setWikiLanguage]);
};
