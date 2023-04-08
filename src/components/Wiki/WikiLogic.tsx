import { MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useI18nContext } from "../../i18n/i18n-react";

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

const useWikiLogic = () => {
  const navigate = useNavigate();
  const { LL } = useI18nContext();
  const invalidLinkText = LL.INVALID_LINK();

  const handleWikiArticleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLAnchorElement;

    const hrefText = getFilteredLink(target?.attributes[0]?.value);

    const parent = target.parentNode as HTMLAnchorElement;
    const parentHref = getFilteredLink(parent?.attributes[0]?.value);

    // not a link - exit
    if (target.nodeName !== "A" && parent.nodeName !== "A") {
      return;
    }

    // handle navigation and leave
    if (handleNavigation(parentHref)) {
      return;
    }

    // handle correct link
    if (hrefText) {
      navigate(hrefText);
      return;
    }

    // if parent is a link
    if (parentHref) {
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
