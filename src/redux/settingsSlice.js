import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";

// https://jsfiddle.net/andykenward/9y1jjsuz

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

export const selectHistory = (state) => state.settings.article.history;

export const selectStartingArticle = (state) =>
  state.settings.article.startingArticle;

export const selectEndingArticle = (state) =>
  state.settings.article.endingArticle;

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
  },
  reducers: {
    startGame: (state, action) => {
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
  },
});

export const selectTimeLimit = (state) => state.settings.game.timeLimit;
export const selectGameIsRunning = (state) => state.settings.game.isRunning;
export const selectIsWin = (state) => state.settings.game.isWin;
export const { startGame, endGame, setTimeLimit, setIsWin } = game.actions;

const settingsReducer = combineReducers({
  article: article.reducer,
  game: game.reducer,
});

export default settingsReducer;
