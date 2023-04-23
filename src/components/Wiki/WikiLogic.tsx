import { MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useI18nContext } from "../../i18n/i18n-react";
import { useStopwatchActions } from "../StopwatchContext";
import { useGameStoreActions } from "../../stores/GameStore";

const errorToast = (text: string) => toast.error(text, { position: "bottom-center" });

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

const getFilteredLink = (hrefText: string | null) => {
  if (!hrefText) return null;
  if (!hrefText.startsWith("/wiki/")) {
    return null;
  }
  if (IMAGE_EXT.some((imgExt) => hrefText.toLowerCase().includes(imgExt))) {
    return null;
  }

  const ignoreList = [
    "/wiki/Wikipedia:",
    "/wiki/Template:",
    "/wiki/Template_talk:",
    "/wiki/Portal:",
    "/wiki/Help:",
    "/wiki/Talk:",
    "/wiki/Special:",
    "/wiki/Category:",
    "/wiki/File:",
  ];
  if (ignoreList.some((item) => hrefText.startsWith(item))) {
    return null;
  }

  return hrefText;
};

const filterOtherStuff = (target: HTMLAnchorElement, errorText: string) => {
  const classNameParent = target?.parentNode as HTMLElement;
  // show notification about non-wiki link
  if (
    target?.className === "external text" ||
    target?.className === "new" ||
    target?.className === "geo-dec" ||
    classNameParent?.className === "reference-text" ||
    classNameParent?.className === "external text" ||
    classNameParent?.className === "new"
  ) {
    errorToast(errorText);
    return true;
  }
  return false;
};

const handleNavigation = (parentHref: string | null) => {
  if (!parentHref) return false;
  if (!parentHref.startsWith("#")) return false;

  let navigateId = parentHref;
  // try to scroll to the element
  navigateId = navigateId.replaceAll("#", "");
  const element = document.getElementById(navigateId);
  element?.scrollIntoView();
  return true;
};

const hrefToText = (href: string) => {
  const urlTitle = href.split("/wiki/")[1];
  return decodeURI(urlTitle).replaceAll("_", " ");
};

const useWikiLogic = () => {
  const navigate = useNavigate();
  const { LL } = useI18nContext();
  const invalidLinkText = LL.INVALID_LINK();
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

    // handle navigation and leave
    const parentHref = getFilteredLink(parent?.attributes[0]?.value);
    if (handleNavigation(parentHref)) {
      return;
    }

    // handle correct link
    const hrefText = getFilteredLink(target?.attributes[0]?.value);
    if (hrefText) {
      addHrefToHistory(hrefText);
      navigate(hrefText);
      return;
    }

    // if parent is a link
    if (parentHref) {
      addHrefToHistory(parentHref);
      navigate(parentHref);
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
