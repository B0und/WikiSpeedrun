import axios from "axios";

export const search = async (searchString) => {
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


export default search;
