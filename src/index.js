import "./wdyr" // <--- must be first import
import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import GlobalStyles from "./components/GlobalStyles"
import { store } from "./redux/store"
import { Provider } from "react-redux"
import { StopwatchProvider } from "./components/Stopwatch/StopwatchContext"
import { ModalsProvider } from "@mantine/modals"
import { NotificationsProvider } from "@mantine/notifications"
import { Global } from "@emotion/react"
import { ThemeProvider } from "./components/ThemeProvider"


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
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
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
