import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
// https://jsfiddle.net/andykenward/9y1jjsuz

const article = createSlice({
  name: "article",
  initialState: { starting: "", ending: "", history: [] },
  reducers: {
    setStartingArticle: (state, action) => {
      state.starting = action.payload;
    },
    setEndingArticle: (state, action) => {
      state.ending = action.payload;
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
