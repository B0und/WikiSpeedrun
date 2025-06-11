import React, { useEffect } from "react";
import useLocalStorage from "use-local-storage";

interface ThemeContext {
  colorMode: string;
  switchTheme: () => void;
}
export const ThemeContext = React.createContext<ThemeContext | null>(null);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [colorMode, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  const switchTheme = () => {
    const newTheme = colorMode === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    if (colorMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorMode]);

  return <ThemeContext.Provider value={{ colorMode, switchTheme }}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeContext");
  }

  return context;
}
