import axios from "axios";
import { useNavigate } from "react-router-dom";

const WikiLogic = () => {
  let navigate = useNavigate();

  const getWikiArticle = async (searchString) => {
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        page: searchString,
        origin: "*",
        action: "parse",
        format: "json",
        disableeditsection: "true",
        redirects: "true", // automatically redirects from plural form
      },
    });
    const html = resp.data.parse.text["*"];
    const title = resp.data.parse.title;
    const pageid = resp.data.parse.pageid;
    return { html, title, pageid };
  };

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

  return { handleWikiArticleClick, getWikiArticle };
};

export default WikiLogic;
