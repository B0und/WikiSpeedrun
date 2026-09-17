import { useNavigate } from "@tanstack/react-router";
import type { SyntheticEvent } from "react";
import { useI18nContext } from "../../i18n/i18n-react";
import { useGameStoreActions } from "../../stores/GameStore";
import { errorToast } from "../../utils/toast";
import { useStopwatchActions } from "../StopwatchContext";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"];

const handleShowHideButton = (e: SyntheticEvent<HTMLDivElement>) => {
  const node = e.target instanceof HTMLElement ? e.target : null;
  const th = node?.closest("th.navbox-title");
  if (!th) return;

  const table = th.closest("table");
  if (!table) return;

  table.classList.toggle("mw-collapsed");
  table.classList.toggle("mw-expanded");
};
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

  const handleClickInsideWikiArticle = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleShowHideButton(e);

    // Traverse up from the event target to find the nearest anchor element
    let node = e.target instanceof HTMLElement ? e.target : null;
    let anchor: HTMLAnchorElement | null = null;
    while (node && node !== e.currentTarget) {
      if (node instanceof HTMLAnchorElement) {
        anchor = node;
        break;
      }
      node = node.parentElement;
    }

    if (!anchor) {
      return;
    }

    if (handleNavigation(anchor)) {
      return;
    }

    const hrefText = getFilteredLink(anchor);

    // handle correct link
    if (hrefText) {
      addHrefToHistory(hrefText);
      /**
       * encodeURIComponent is needed because articles with slashes break
       * TODO rewrite to query params instead of path segments??
       */
      const articleTitle = hrefText.replace("/wiki/", "");
      const encodedTitle = encodeURIComponent(articleTitle.replaceAll(" ", "_"));
      void navigate({ to: `/wiki/${encodedTitle}` });
      return;
    }

    // handle misc stuff
    if (filterOtherStuff(anchor, invalidLinkText)) {
      return;
    }

    errorToast(invalidLinkText);
  };

  return { handleClickInsideWikiArticle };
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
  if (
    ["https://www.wikidata.org", "www.wikidata.org", "commons.wikimedia.org"].includes(
      element.hostname,
    )
  ) {
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
  const classNameParent = target.parentElement;
  // show notification about non-wiki link
  if (
    target.className === "external text" ||
    target.className === "new" ||
    target.className === "geo-dec" ||
    (classNameParent &&
      (classNameParent.className === "reference-text" ||
        classNameParent.className === "external text" ||
        classNameParent.className === "new"))
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
