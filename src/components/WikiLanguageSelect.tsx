import Select from "react-select";
import { useLingui } from "@lingui/react/macro";
import { useGameStoreActions } from "../stores/GameStore";
import { useSettingsStoreActions, useWikiLanguage } from "../stores/SettingsStore";
import { useThemeContext } from "./ThemeContext";
import { reactSelectStyles } from "./reactSelectStyles";
import { LANGUAGES } from "./Wiki/wikiLanguages";
import type { WikiLanguageEntry } from "./Wiki/wikiLanguages";

const selectId = "wikiLanguageSelect";

export const WikiLanguageSelect = () => {
  const { colorMode } = useThemeContext();
  const isDarkMode = colorMode === "dark";
  const { t } = useLingui();
  const { setWikiLanguage } = useSettingsStoreActions();
  const wikiLanguage = useWikiLanguage();
  const { setEndingArticle, setStartingArticle } = useGameStoreActions();

  return (
    <div>
      <label htmlFor={selectId}>{t({ id: "Select article language" })}</label>
      <Select
        key={wikiLanguage}
        inputId={selectId}
        defaultValue={LANGUAGES.find((language) => language.value === wikiLanguage)}
        isClearable={false}
        isSearchable={true}
        name={selectId}
        styles={reactSelectStyles<WikiLanguageEntry>({
          isDarkMode,
          controlMaxWidth: "300px",
          menuWidth: "300px",
        })}
        options={LANGUAGES}
        onChange={(e) => {
          setWikiLanguage(e?.value ?? "");
          setStartingArticle({ pageid: "", title: "" });
          setEndingArticle({ pageid: "", title: "" });
        }}
        isMulti={false}
        classNames={{
          option: () => "language-option",
        }}
      />
    </div>
  );
};
