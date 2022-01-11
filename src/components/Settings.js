import styled from "styled-components/macro";
import ComboBoxSearch from "./ComboBoxSearch";

function Settings() {
  const startId = "starting-article";
  const endId = "ending-article"

  return (
    <Wrapper>
      <Title>Settings</Title>
      <SettingField>
        <label htmlFor={startId}>Starting Article</label>
        <ComboBoxSearch inputId={startId} />
        <button>
          <img src="./dice.svg" />
        </button>
      </SettingField>
      <SettingField>
       <label htmlFor={endId}>Ending Article</label>
        <ComboBoxSearch inputId={endId} />
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
