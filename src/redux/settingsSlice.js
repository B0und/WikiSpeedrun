import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";

const article = createSlice({
  name: "article",
  initialState: {
    startingArticle: { title: "", pageid: -1 },
    endingArticle: { title: "", pageid: -1 },
    history: [],
  },
  reducers: {
    setStartingArticle: (state, action) => {
      state.startingArticle.title = action.payload.title;
      state.startingArticle.pageid = action.payload.pageid;
    },
    setEndingArticle: (state, action) => {
      state.endingArticle.title = action.payload.title;
      state.endingArticle.pageid = action.payload.pageid;
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
    resetHistory: (state) => {
      state.history = [];
    },
  },
});

export const {
  setStartingArticle,
  setEndingArticle,
  addToHistory,
  resetHistory,
} = article.actions;

const game = createSlice({
  name: "game",
  initialState: {
    isRunning: false,
    timeLimit: 0,
    isWin: null,
    winTime: 0,
  },
  reducers: {
    startGame: (state) => {
      state.isRunning = true;
    },
    endGame: (state) => {
      state.isRunning = false;
    },
    setTimeLimit: (state, action) => {
      state.timeLimit = action.payload;
    },
    setIsWin: (state, action) => {
      state.isWin = action.payload;
    },
    setWinTime: (state, action) => {
      state.winTime = action.payload;
    },
  },
});

export const { startGame, endGame, setTimeLimit, setIsWin, setWinTime } =
  game.actions;

const settingsReducer = combineReducers({
  article: article.reducer,
  game: game.reducer,
});

export default settingsReducer;
