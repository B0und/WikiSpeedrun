import styled from "styled-components/macro";

function Logo() {
  return (
    <Heading>
      <Link href="/">
        <Image src={window.location.origin + "/wiki-speed-logo.jpg"} alt="Wikipedia Speedrun" />
      </Link>
    </Heading>
  );
}

const Heading = styled.h1``;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Image = styled.img`
  min-width: 120px;
`;

export default Logo;
