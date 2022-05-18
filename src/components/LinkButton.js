import { Link } from "react-router-dom"
import styled from "@emotion/styled"

const LinkButton = ({ text, ...rest }) => {
  return <ButtonLink {...rest}>{text}</ButtonLink>
}

const ButtonLink = styled(Link)`
  text-decoration: none;
  background-color: #f8f8f8;
  color: var(--color-text-primary);
  text-align: center;
  padding: 10px 20px;
  width: 120px;
`

export default LinkButton
