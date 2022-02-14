import axios from "axios";

const search = async (debouncedTerm) => {
  const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
    params: {
      action: "query",
      list: "search",
      origin: "*",
      format: "json",
      srsearch: debouncedTerm,
    },
  });
  if (data.query) {
    let articles = data.query.search;
    return articles;
  }
};

export default search;
