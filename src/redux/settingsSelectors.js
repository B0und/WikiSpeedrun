export const selectHistory = (state) => state.settings.article.history;

export const selectStartingArticle = (state) =>
  state.settings.article.startingArticle;

export const selectEndingArticle = (state) =>
  state.settings.article.endingArticle;

export const selectTimeLimit = (state) => state.settings.game.timeLimit;
export const selectGameIsRunning = (state) => state.settings.game.isRunning;
export const selectIsWin = (state) => state.settings.game.isWin;
export const selectWinTime = (state) => state.settings.game.winTime;
