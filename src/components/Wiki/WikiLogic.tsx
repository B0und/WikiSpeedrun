import type { MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useI18nContext } from "../../i18n/i18n-react";
import { useGameStoreActions } from "../../stores/GameStore";
import { useStopwatchActions } from "../StopwatchContext";

const errorToast = (text: string) => toast.error(text, { position: "bottom-center" });

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"];

const useWikiLogic = () => {
  const navigate = useNavigate();
  const { LL } = useI18nContext();
  const invalidLinkText = LL["Choose another link"]();
  const { getFormattedTime } = useStopwatchActions();
  const { addHistoryArticle } = useGameStoreActions();

  const addHrefToHistory = (href: string) => {
    const time = getFormattedTime();
    const { min, ms, sec } = time;

    const title = hrefToText(href);
    addHistoryArticle({
      title,
      time: { min, sec, ms },
      winningLinks: 0,
    });
  };

  const handleWikiArticleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLAnchorElement;
    const parent = target.parentNode as HTMLAnchorElement;
    // not a link - exit
    if (target.nodeName !== "A" && parent.nodeName !== "A") {
      return;
    }

    if (handleNavigation(parent) || handleNavigation(target)) {
      return;
    }

    const parentHref = getFilteredLink(parent);
    const hrefText = getFilteredLink(target);

    // handle correct link
    if (hrefText) {
      addHrefToHistory(hrefText);
      /**
       * encodeURIComponent is needed because articles with slashes break
       * TODO rewrite to query params instead of path segments??
       */
      void navigate(encodeURIComponent(hrefText));
      return;
    }

    // if parent is a link
    if (parentHref) {
      addHrefToHistory(parentHref);
      void navigate(encodeURIComponent(parentHref));
      return;
    }

    // handle misc stuff
    if (filterOtherStuff(target, invalidLinkText)) {
      return;
    }

    errorToast(invalidLinkText);
  };

  return { handleWikiArticleClick };
};

export default useWikiLogic;

function isScrollingAnchor(node: HTMLElement): boolean {
  // Check if the node is an anchor tag
  if (node.tagName.toLowerCase() === "a") {
    // Check if the href attribute starts with #
    const href = node.getAttribute("href");
    return href?.startsWith("#") ?? false;
  }
  return false;
}

function scrollToElement(elementId: string | null | undefined) {
  if (!elementId) {
    return;
  }
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const getFilteredLink = (element: HTMLAnchorElement) => {
  const hrefText = element.getAttribute("href");

  if (!hrefText) return null;
  if (!hrefText.startsWith("/wiki/")) {
    return null;
  }

  if (IMAGE_EXT.some((imgExt) => hrefText.toLowerCase().includes(imgExt))) {
    return null;
  }
  if (["https://www.wikidata.org", "www.wikidata.org", "commons.wikimedia.org"].includes(element.hostname)) {
    return null;
  }

  const ignoreList = [
    "Wikipedia:",
    "Template:",
    "Шаблон:",
    "Template talk:",
    "Portal:",
    "Help:",
    "Talk:",
    "Special:",
    "Category:",
    "File:",
    "Википедия:",
  ];
  if (ignoreList.some((item) => element.title.startsWith(item))) {
    return null;
  }

  return hrefText;
};

const filterOtherStuff = (target: HTMLAnchorElement, errorText: string) => {
  const classNameParent = target.parentNode as HTMLElement;
  // show notification about non-wiki link
  if (
    target.className === "external text" ||
    target.className === "new" ||
    target.className === "geo-dec" ||
    classNameParent.className === "reference-text" ||
    classNameParent.className === "external text" ||
    classNameParent.className === "new"
  ) {
    errorToast(errorText);
    return true;
  }
  return false;
};

// test cases
// Википедия:Ссылки на источники
const handleNavigation = (node: HTMLAnchorElement) => {
  if (isScrollingAnchor(node)) {
    const hrefWithoutHash = node.getAttribute("href")?.substring(1);
    scrollToElement(hrefWithoutHash);
    return true;
  }

  return false;
};

const hrefToText = (href: string) => {
  const urlTitle = href.split("/wiki/")[1];

  return decodeURI(urlTitle).replaceAll("_", " ");
};
