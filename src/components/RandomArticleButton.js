import axios from "axios";
import UnstyledButton from "./UnstyledButton";
import styled from "styled-components/macro";
import { useDispatch } from "react-redux";

const RandomArticleButton = ({ dispatchFn }) => {
  const dispatch = useDispatch();

  const getRandomWikiArticle = async () => {
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        origin: "*",
        action: "query",
        format: "json",
        list: "random",
        rnnamespace: "0",
        rnlimit: "1",
      },
    });
    const title = resp.data.query.random[0].title;
    return { title };
  };

  const randomHandler = async (fn) => {
    const article = await getRandomWikiArticle().catch((e) =>
      console.error(`Couldnt fetch wiki data: ${e.message}`)
    );
    article && dispatch(fn(article));
  };

  return (
    <RandomButton onClick={() => randomHandler(dispatchFn)} type="button">
      <img
        src={window.location.origin + "/dice.svg"}
        alt="Select random article"
        width={25}
        height={26}
      />
    </RandomButton>
  );
};

const RandomButton = styled(UnstyledButton)`
  padding: 16px;
  margin-bottom: 5px;

  img {
    min-width: 24px;
  }
`;

export default RandomArticleButton;
