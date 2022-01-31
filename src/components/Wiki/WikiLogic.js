import { useNavigate } from "react-router-dom";

const WikiLogic = () => {
  let navigate = useNavigate();

  const validateHref = (hrefText) => {
    if (hrefText === undefined) return null;
    if (hrefText.startsWith("/wiki/")) {
      return hrefText;
    } else {
      return null;
    }
  };

  const validateNavigation = (hrefText) => {
    if (hrefText === undefined) return null;
    if (hrefText.startsWith("#")) {
      return hrefText;
    } else {
      return null;
    }
  };

  const handleWikiArticleClick = (e) => {
    e.preventDefault();

    // if clicked on a link
    let href = validateHref(e?.target?.attributes[0]?.value);
    if (href) {
      navigate(href);
      return;
    }

    // if parent is a link
    href = validateHref(e.target?.parentNode?.attributes[0]?.value);
    if (href) {
      navigate(href);
      return;
    }

    // if clicked on navigation
    let navigateId = validateNavigation(
      e.target?.parentNode?.attributes[0]?.value
    );
    if (navigateId) {
      navigateId = navigateId.replaceAll("#", "");
      const element = document.getElementById(navigateId);
      element?.scrollIntoView();
    }
  };

  return { handleWikiArticleClick };
};

export default WikiLogic;
