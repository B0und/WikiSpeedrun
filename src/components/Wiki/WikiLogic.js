import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";

const WikiLogic = () => {
  let navigate = useNavigate();
  const notifications = useNotifications();

  const errorParams = {
    title: "Wrong link",
    message: "Try another one",
    autoClose: 1500,
    color: "red",
  };

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
    }

    return null;
  };

  const validateNavigation = (hrefText) => {
    if (hrefText === undefined) return null;
    if (hrefText.startsWith("#")) {
      return hrefText;
    } else {
      return null;
    }
  };

  const handleWikiArticleClick = (e, ref) => {
    e.preventDefault();

    // if clicked on a link
    const hrefText = e?.target?.attributes[0]?.value;
    let href = validateHref(hrefText);

    // if its a cite note, show error
    if (hrefText?.includes("#cite_note-")) {
      notifications.showNotification(errorParams);
      return;
    }

    if (href) {
      navigate(href);
      ref?.current?.scrollIntoView();
      return;
    }

    // if parent is a link
    href = validateHref(e.target?.parentNode?.attributes[0]?.value);
    if (href) {
      navigate(href);
      ref?.current?.scrollIntoView();
      return;
    }

    // if clicked on navigation link
    let navigateId = validateNavigation(
      e.target?.parentNode?.attributes[0]?.value
    );

    // try to scroll to the element
    if (navigateId) {
      navigateId = navigateId.replaceAll("#", "");
      const element = document.getElementById(navigateId);
      element?.scrollIntoView();

      return;
    }

    // show notification about non-wiki link
    if (
      e?.target?.className === "external text" ||
      e?.target?.className === "new" ||
      e?.target?.className === "geo-dec" ||
      e?.target?.parentNode?.className === "reference-text" ||
      e?.target?.parentNode?.className === "external text" ||
      e?.target?.parentNode?.className === "new"
    ) {
      notifications.showNotification(errorParams);
      return;
    }
  };

  return { handleWikiArticleClick, getWikiArticle };
};

export default WikiLogic;
