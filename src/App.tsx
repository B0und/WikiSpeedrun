import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { detectLocale } from "./i18n/i18n-util";
import TypesafeI18n from "./i18n/i18n-react";
import { localStorageDetector } from "typesafe-i18n/detectors";
import { loadLocaleAsync } from "./i18n/i18n-util.async";
import Test from "./components/Test";

// Detect locale
// (Use as advanaced locale detection strategy as you like.
// More info: https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)
const locale = detectLocale(localStorageDetector);

function App() {
  const [localesLoaded, setLocalesLoaded] = useState(false);
  useEffect(() => {
    loadLocaleAsync(locale).then(() => setLocalesLoaded(true));
  }, [locale]);

  if (!localesLoaded) {
    return null;
  }

  return (
    <TypesafeI18n locale={locale}>
      <h1 className="text-3xl font-bold underline text-red-600">
        Hello world!
      </h1>
      <Test />
      <div className="App">test</div>
    </TypesafeI18n>
  );
}

export default App;
