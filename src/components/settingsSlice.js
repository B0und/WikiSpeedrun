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

const timer = createSlice({
  name: "timer",
  initialState: { time: 0, offset: 0, isRunning: false },
  reducers: {
    start: (state, action) => {
      state.isRunning = true;
      state.offset = action.payload.time;
    },
    stop: (state, action) => {
      state.isRunning = false;
    },
    tick: (state, action) => {
      state.time = state.time + (action.payload - state.offset);
      state.offset = action.payload;
    },
  },
});

export const { start, stop, tick } = timer.actions;

const settingsReducer = combineReducers({
  article: article.reducer,
  timer: timer.reducer,
});

export default settingsReducer;
