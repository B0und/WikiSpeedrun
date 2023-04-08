import { toast } from "react-hot-toast";
import { WikiRandom } from "./RandomButton/RandomButton.types";
import { useI18nContext } from "../i18n/i18n-react";

export const getHighestLinksPage = (data: WikiRandom) => {
  if (!data.query?.pages) return;
  const highestLinksPage = Object.values(data.query.pages)
    .filter((page) => Object.prototype.hasOwnProperty.call(page, "linkshere"))
    .reduce((prev, current) => {
      const previousLinksphere = prev?.linkshere ?? [];
      const currentLinksphere = current?.linkshere ?? [];
      return previousLinksphere.length > currentLinksphere.length ? prev : current;
    });

  const title = highestLinksPage.title;
  const pageid = highestLinksPage.pageid;
  return { title, pageid };
};

interface RandomSuccessProps {
  setArticle: (article: string) => void;
  data: WikiRandom;
  failText: string;
}

const errorToast = (text : string) => toast.error(text, { position: "bottom-center" });

export const handleOnRandomSuccess = ({ setArticle, data, failText }: RandomSuccessProps) => {
  const articleWithLinks = getHighestLinksPage(data);
  if (!articleWithLinks?.title || articleWithLinks?.title.includes("(disambiguation)")) {
    errorToast(failText);
    return;
  }
  setArticle(articleWithLinks?.title);
};
