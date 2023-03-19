import { MouseEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const errorToast = () => toast.error('Choose another link', { position: 'bottom-center' });

const getFilteredLink = (hrefText: string | null) => {
  if (!hrefText) return null;
  if (!hrefText.startsWith('/wiki/')) {
    return null;
  }

  const ignoreList = [
    '/wiki/Wikipedia:',
    '/wiki/Template:',
    '/wiki/Template_talk:',
    '/wiki/Portal:',
    '/wiki/Help:',
    '/wiki/Talk:',
    '/wiki/Special:',
    '/wiki/Category:',
    '/wiki/File:',
  ];
  if (ignoreList.some((item) => hrefText.startsWith(item))) {
    return null;
  }

  return hrefText;
};

const filterOtherStuff = (target: HTMLAnchorElement) => {
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
    errorToast();
    return true;
  }
  return false;
};

const handleNavigation = (parentHref: string | null) => {
  if (!parentHref) return false;
  if (!parentHref.startsWith('#')) return false;

  let navigateId = parentHref;
  // try to scroll to the element
  navigateId = navigateId.replaceAll('#', '');
  const element = document.getElementById(navigateId);
  element?.scrollIntoView();
  return true;
};

const useWikiLogic = () => {
  const navigate = useNavigate();

  const handleWikiArticleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLAnchorElement;

    const hrefText = getFilteredLink(target?.attributes[0]?.value);

    const parent = target.parentNode as HTMLAnchorElement;
    const parentHref = getFilteredLink(parent?.attributes[0]?.value);

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
    if (filterOtherStuff(target)) {
      return;
    }

    errorToast();
  };

  return { handleWikiArticleClick };
};

export default useWikiLogic;
