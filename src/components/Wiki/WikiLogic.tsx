import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNotifications } from "@mantine/notifications";

const useWikiLogic = () => {
  const navigate = useNavigate();
  //   const notifications = useNotifications();

  //   const errorParams = {
  //     title: "Wrong link",
  //     message: "Try another one",
  //     autoClose: 1500,
  //     color: "red",
  //   };

  const validateHref = (hrefText: string) => {
    if (hrefText === undefined) return null;
    if (hrefText.startsWith('/wiki/')) {
      return hrefText;
    }

    return null;
  };

  const validateNavigation = (hrefText: string) => {
    if (hrefText === undefined) return null;
    if (hrefText.startsWith('#')) {
      return hrefText;
    } else {
      return null;
    }
  };

  const handleWikiArticleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLAnchorElement;

    // if clicked on a link
    const hrefText = target?.attributes[0]?.value;
    let href = validateHref(hrefText);

    //  Show error:
    // if its a cite note
    // an image
    if (hrefText?.includes('#cite_note-') || target?.nodeName === 'IMG') {
      //   notifications.showNotification(errorParams);
      return;
    }

    if (href) {
      navigate(href);
      return;
    }

    const parent = target.parentNode as HTMLAnchorElement;
    // if parent is a link
    href = validateHref(parent?.attributes[0]?.value);
    if (href) {
      navigate(href);
      return;
    }

    // if clicked on navigation link
    let navigateId = validateNavigation(parent?.attributes[0]?.value);
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
