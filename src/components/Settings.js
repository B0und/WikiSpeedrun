import styled from "styled-components/macro";

function Settings() {
  return (
    <Wrapper>
      <Title>Settings</Title>
      <SettingField>
        <p>Starting Article</p>
        <input type="text" placeholder="Search..."></input>
        <button>
          <img src="./dice.svg" />
        </button>
      </SettingField>
      <SettingField>
        <p>Ending Article</p>
        <input type="text" placeholder="Search..."></input>
        <button>
          <img src="./dice.svg" />
        </button>
      </SettingField>
      <StartButton>Start</StartButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: var(--border-gap);
  gap: 32px;

  width: fit-content;
`;

const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: 600;
`;

const SettingField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 32px;

  /* direct children */
  & > :first-child {
    flex: 1;
  }
`;

const StartButton = styled.button`
  border: none;
  padding: 10px 20px;
  width: 120px;
`;
export default Settings;
