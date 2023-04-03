import { WikiRandom } from "./RandomButton/RandomButton.types";

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
}

export const handleOnRandomSuccess = ({ setArticle, data }: RandomSuccessProps) => {
  const articleWithLinks = getHighestLinksPage(data);
  if (!articleWithLinks?.title) {
    return; // todo show error notification
  }
  setArticle(articleWithLinks?.title);
};
