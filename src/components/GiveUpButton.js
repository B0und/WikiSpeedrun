import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { useModals } from "@mantine/modals";
import { endGame, resetHistory } from "../redux/settingsSlice";
import { StopwatchContext } from "./Stopwatch/StopwatchContext";

const GiveUpButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modals = useModals();
  const stopwatch = useContext(StopwatchContext);

  const onConfirm = () => {
    dispatch(endGame());
    dispatch(resetHistory());
    stopwatch.resetTimer();
    stopwatch.disableTimer(false);
    navigate("/settings");
  };

  const openGiveUpModal = () =>
    modals.openConfirmModal({
      title: "Are you sure you want to give up?",
      children: <p>All progress will be lost.</p>,
      labels: { confirm: "Give up", cancel: "Continue" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: onConfirm,
    });

  return <StyledButton onClick={openGiveUpModal}>Give up</StyledButton>;
};

const StyledButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  color: black;
  text-align: center;
  padding: 16px;

  &:hover {
    color: blue;
  }
`;

export default GiveUpButton;
