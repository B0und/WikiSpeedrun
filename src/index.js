import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import GlobalStyles from "./components/GlobalStyles";
import reportWebVitals from "./reportWebVitals";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { StopwatchProvider } from "./components/Stopwatch/StopwatchContext";
import { ModalsProvider } from "@mantine/modals";

ReactDOM.render(
  <React.StrictMode>
    <ModalsProvider>
      <StopwatchProvider>
        <Provider store={store}>
          <App />
        </Provider>
        <GlobalStyles />
      </StopwatchProvider>
    </ModalsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
