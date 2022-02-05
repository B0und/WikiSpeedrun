import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const LinkButton = ({ text, ...rest }) => {
  return <ButtonLink {...rest}>{text}</ButtonLink>;
};

const ButtonLink = styled(Link)`
  text-decoration: none;
  background-color: #e9e9ed;
  color: black;
  text-align: center;
  padding: 10px 20px;
  width: 120px;
`;

export default LinkButton;
