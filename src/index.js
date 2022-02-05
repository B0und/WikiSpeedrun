import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import GlobalStyles from "./components/GlobalStyles";
import reportWebVitals from "./reportWebVitals";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { StopwatchProvider } from "./components/Stopwatch/StopwatchContext";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { Global } from "@emotion/react";

ReactDOM.render(
  <React.StrictMode>
    <ModalsProvider>
      <NotificationsProvider>
        <StopwatchProvider>
          <Provider store={store}>
            <App />
          </Provider>
          <Global styles={GlobalStyles} />
        </StopwatchProvider>
      </NotificationsProvider>
    </ModalsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
