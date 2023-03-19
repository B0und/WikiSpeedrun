import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEndingArticle } from '../../GameStore';
// import { useNotifications } from "@mantine/notifications";

const isWikiLink = (hrefText: string | null) => {
  if (!hrefText) return null;
  if (hrefText.startsWith('/wiki/')) {
    return hrefText;
  }

  return null;
};

const validateNavigation = (hrefText: string | null) => {
  if (!hrefText) return null;
  if (hrefText.startsWith('#')) {
    return hrefText;
  } else {
    return null;
  }
};

const useWikiLogic = () => {
  const navigate = useNavigate();
  const targetArticle = useEndingArticle();
  //   const notifications = useNotifications();

  //   const errorParams = {
  //     title: "Wrong link",
  //     message: "Try another one",
  //     autoClose: 1500,
  //     color: "red",
  //   };

  // const checkIfWin = () => {};

  const handleWikiArticleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLAnchorElement;

    const hrefText = isWikiLink(target?.attributes[0]?.value);

    const parent = target.parentNode as HTMLAnchorElement;
    const parentHref = isWikiLink(parent?.attributes[0]?.value);

    //  Show error:
    // if its a cite note
    // or an image
    console.log(hrefText);
    console.log(target);
    if (
      !hrefText ||
      hrefText?.includes('#cite_note-') ||
      target?.nodeName === 'IMG' ||
      hrefText.startsWith('/wiki/Wikipedia:') ||
      hrefText.startsWith('/wiki/Template:') ||
      hrefText.startsWith('/wiki/Portal:')
    ) {
      //   notifications.showNotification(errorParams);
      return;
    }

    if (hrefText) {
      console.log('hrefText:', decodeURI(hrefText));
      navigate(hrefText);
      return;
    }

    // if parent is a link
    if (parentHref) {
      navigate(parentHref);
      return;
    }

    // if clicked on navigation link
    let navigateId = validateNavigation(parentHref);
    if (navigateId) {
      // try to scroll to the element
      navigateId = navigateId.replaceAll('#', '');
      const element = document.getElementById(navigateId);
      element?.scrollIntoView();
      return;
    }

    const classNameParent = target?.parentNode as HTMLElement;
    // show notification about non-wiki link
    if (
      target?.className === 'external text' ||
      target?.className === 'new' ||
      target?.className === 'geo-dec' ||
      classNameParent?.className === 'reference-text' ||
      classNameParent?.className === 'external text' ||
      classNameParent?.className === 'new'
    ) {
      //   notifications.showNotification(errorParams);
      return;
    }
  };

  return { handleWikiArticleClick };
};

export default useWikiLogic;
