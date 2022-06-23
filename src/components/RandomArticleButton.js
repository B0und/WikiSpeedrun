import axios from "axios"
import styled from "@emotion/styled"
import { useDispatch } from "react-redux"
import VisuallyHidden from "@reach/visually-hidden"

import UnstyledButton from "./UnstyledButton"
import { ReactComponent as DiceIcon } from "../media/dice.svg"

const RandomArticleButton = ({ dispatchFn }) => {
  const dispatch = useDispatch()

  const getRandomWikiArticle = async () => {
    const { data } = await axios.get(
      `https://en.wikipedia.org/w/api.php?origin=%2A&action=query&format=json&generator=random&grnnamespace=0&grnlimit=5&prop=linkshere&lhnamespace=0&lhlimit=500&lhshow=%21redirect&lhprop=pageid`
    )

    const highestLinksPage = Object.values(data.query.pages)
      .filter((page) => page.hasOwnProperty("linkshere"))
      .reduce((prev, current) =>
        prev.linkshere?.length > current.linkshere?.length ? prev : current
      )

    const title = highestLinksPage.title
    const pageid = highestLinksPage.pageid

    return { title, pageid }
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
