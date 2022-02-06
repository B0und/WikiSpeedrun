import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import GlobalStyles from "./components/GlobalStyles";
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

