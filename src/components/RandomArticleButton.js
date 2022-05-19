import axios from "axios"
import styled from "@emotion/styled"
import { useDispatch } from "react-redux"
import VisuallyHidden from "@reach/visually-hidden"

import UnstyledButton from "./UnstyledButton"
import { ReactComponent as DiceIcon } from "../media/dice.svg"

const RandomArticleButton = ({ dispatchFn }) => {
  const dispatch = useDispatch()

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
    })

    const title = resp.data.query.random[0].title

    return { title }
  }

  const randomHandler = async (fn) => {
    const article = await getRandomWikiArticle().catch((e) =>
      console.error(`Couldnt fetch wiki data: ${e.message}`)
    )
    article && dispatch(fn(article))
  }

  const onClickHander = () => {
    randomHandler(dispatchFn)
  }

  return (
    <RandomButton onClick={onClickHander} type="button">
      <VisuallyHidden>Select random article</VisuallyHidden>
      <DiceIcon aria-hidden="true" />
    </RandomButton>
  )
}

const RandomButton = styled(UnstyledButton)`
  padding: 16px;
  margin-bottom: 5px;
  color: var(--color-text-primary);
  img {
    min-width: 24px;
  }
`

export default RandomArticleButton
