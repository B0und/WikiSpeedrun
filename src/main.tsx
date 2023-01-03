import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import TypesafeI18n from "./i18n/i18n-react"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TypesafeI18n locale="en">
      <App />
    </TypesafeI18n>
  </React.StrictMode>
)
