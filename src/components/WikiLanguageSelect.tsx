import clsx from "clsx";
import Select, { StylesConfig } from "react-select";
import { useThemeContext } from "./ThemeContext";
import { useI18nContext } from "../i18n/i18n-react";
import { useSettingsStoreActions, useWikiLanguage } from "../stores/SettingsStore";
import { useGameStoreActions } from "../stores/GameStore";

const selectId = "wikiLanguageSelect";

export const WikiLanguageSelect = () => {
  const { colorMode } = useThemeContext();
  const isDarkMode = colorMode === "dark";
  const { LL } = useI18nContext();
  const { setWikiLanguage } = useSettingsStoreActions();
  const wikiLanguage = useWikiLanguage();
  const { setEndingArticle, setStartingArticle } = useGameStoreActions();

  return (
    <div>
      <label htmlFor={selectId}>{LL.SELECT_ARTICLE_LANGUAGE()}</label>
      <Select
        key={wikiLanguage}
        inputId={selectId}
        defaultValue={LANGUAGES.find((language) => language.value === wikiLanguage)}
        isClearable={false}
        isSearchable={true}
        name={selectId}
        styles={customStyles}
        options={LANGUAGES}
        onChange={(e) => {
          setWikiLanguage(e?.value ?? "");
          setStartingArticle({ pageid: "", title: "" });
          setEndingArticle({ pageid: "", title: "" });
        }}
        isMulti={false}
        classNames={{
          control: () => clsx(isDarkMode && "dark:bg-dark-surface dark:text-dark-primary", ""),
          menu: () =>
            clsx(
              isDarkMode && "dark:bg-dark-surface-secondary dark:text-dark-primary",
              "bg-neutral-50"
            ),
          loadingIndicator: () => (isDarkMode ? "dark:bg-dark-surface" : ""),
          noOptionsMessage: () =>
            isDarkMode ? "dark:bg-dark-surface-secondary dark:text-dark-primary" : "",
          singleValue: () => (isDarkMode ? " dark:text-dark-primary" : ""),
          option: (state) =>
            clsx(
              state.isFocused && "dark:bg-[#464242] dark:text-primary-blue",
              isDarkMode && `dark:bg-dark-surface-secondary dark:text-dark-primary`
            ),
          loadingMessage: () =>
            isDarkMode ? "dark:bg-dark-surface-secondary dark:text-dark-primary" : "",
        }}
      />
    </div>
  );
};

const customStyles: StylesConfig<WikiLanguage> = {
  control: (base) => ({
    ...base,
    maxWidth: "300px",
    backgroundColor: "#fafafa",
    "&:hover": {
      borderColor: "hsla(203, 66%, 56%)",
    },
    "&:focus": {
      boxShadow: "0 0 0 1px hsla(203, 66%, 56%)",
    },
  }),
  menu: (base) => ({
    ...base,
    width: "300px",
  }),
};

interface WikiLanguage {
  readonly value: string; // WP language code
  readonly label: string;
  readonly isoCode: string; // ISO language code
}

export const LANGUAGES: readonly WikiLanguage[] = [
  { value: "en", label: "English", isoCode: "en" },
  { value: "ceb", label: "Cebuano", isoCode: "ceb" },
  { value: "de", label: "Deutsch", isoCode: "de" },
  { value: "sv", label: "Svenska", isoCode: "se" },
  { value: "fr", label: "Français", isoCode: "fr" },
  { value: "nl", label: "Nederlands", isoCode: "nl" },
  { value: "ru", label: "Русский", isoCode: "ru" },
  { value: "es", label: "Español", isoCode: "es" },
  { value: "it", label: "Italiano", isoCode: "it" },
  { value: "arz", label: "مصرى", isoCode: "" },
  { value: "pl", label: "Polski", isoCode: "pl" },
  { value: "ja", label: "日本語", isoCode: "jp" },
  { value: "zh", label: "中国人", isoCode: "cn" },
  { value: "vi", label: "Tiếng Việt", isoCode: "vi" },
  { value: "war", label: "Winaray", isoCode: "" },
  { value: "uk", label: "українська", isoCode: "" },
  { value: "ar", label: "عربي", isoCode: "ar" },
  { value: "pt", label: "Português", isoCode: "pt" },
  { value: "fa", label: "فارسی", isoCode: "fa" },
  { value: "ca", label: "català", isoCode: "ca" },
  { value: "sr", label: "српски / srpski", isoCode: "sr" },
  { value: "id", label: "bahasa Indonesia", isoCode: "id" },
  { value: "ko", label: "한국어", isoCode: "ko" },
  { value: "no", label: "norsk", isoCode: "no" },
  { label: "нохчийн", value: "ce", isoCode: "" },
  { label: "suomi", value: "fi", isoCode: "" },
  { label: "magyar", value: "hu", isoCode: "" },
  { label: "čeština", value: "cs", isoCode: "" },
  { label: "Türkçe", value: "tr", isoCode: "" },
  { label: "tatarça", value: "tt", isoCode: "" },
  { label: "srpskohrvatski", value: "sh", isoCode: "" },
  { label: "română", value: "ro", isoCode: "" },
  { label: "Bân-lâm-gú", value: "zh-min-nan", isoCode: "" },
  { label: "euskara", value: "eu", isoCode: "" },
  { label: "Bahasa Melayu", value: "ms", isoCode: "" },
  { label: "Esperanto", value: "eo", isoCode: "" },
  { label: "עברית", value: "he", isoCode: "" },
  { label: "հայերեն", value: "hy", isoCode: "" },
  { label: "dansk", value: "da", isoCode: "" },
  { label: "български", value: "bg", isoCode: "" },
  { label: "Cymraeg", value: "cy", isoCode: "" },
  { label: "slovenčina", value: "sk	", isoCode: "" },
  { label: "تۆرکجه", value: "azb", isoCode: "" },
  { label: "eesti", value: "et", isoCode: "" },
  { label: "қазақша", value: "kk", isoCode: "" },
  { label: "беларуская", value: "be", isoCode: "" },
  { label: "Simple English", value: "simple", isoCode: "" },
  { label: "Minangkabau", value: "min", isoCode: "" },
  { label: "oʻzbekcha", value: "uz", isoCode: "" },
  { label: "Ελληνικά", value: "el", isoCode: "" },
  { label: "hrvatski", value: "hr", isoCode: "" },
  { label: "lietuvių", value: "lt", isoCode: "" },
  { label: "galego", value: "gl", isoCode: "" },
  { label: "azərbaycanca", value: "az", isoCode: "" },
  { label: "اردو", value: "ur", isoCode: "" },
  { label: "slovenščina", value: "sl", isoCode: "" },
  { label: "ქართული", value: "ka", isoCode: "" },
  { label: "norsknynorsk", value: "nn", isoCode: "" },
  { value: "hi", label: "हिंदी", isoCode: "hi" },
  { label: "ไทย", value: "th", isoCode: "" },
  { label: "தமிழ்", value: "ta", isoCode: "" },
  { label: "Latina", value: "la", isoCode: "" },
  { label: "বাংলা", value: "bn", isoCode: "" },
  { label: "македонски", value: "mk", isoCode: "" },
  { label: "asturianu", value: "ast", isoCode: "" },
  { label: "粵語	zh", value: "yue", isoCode: "" },
  { label: "Ladin", value: "lld", isoCode: "" },
  { label: "latviešu", value: "lv", isoCode: "" },
  { label: "тоҷикӣ", value: "tg", isoCode: "" },
  { label: "Afrikaans", value: "af", isoCode: "" },
  { label: "မြန်မာဘာသာ", value: "my", isoCode: "" },
  { label: "Malagasy", value: "mg", isoCode: "" },
  { label: "bosanski", value: "bs", isoCode: "" },
  { label: "मराठी", value: "mr", isoCode: "" },
  { label: "shqip", value: "sq", isoCode: "" },
  { label: "occitan", value: "oc", isoCode: "" },
  { label: "Plattdüütsch", value: "nds", isoCode: "" },
  { label: "മലയാളം", value: "ml", isoCode: "" },
  { label: "беларуская (тарашкевіца)", value: "be-tarask", isoCode: "" },
  { label: "తెలుగు", value: "te", isoCode: "" },
  { label: "кыргызча", value: "ky", isoCode: "" },
  { label: "brezhoneg", value: "br", isoCode: "" },
  { label: "Kiswahili", value: "sw", isoCode: "" },
  { label: "Jawa", value: "jv", isoCode: "" },
  { label: "नेपाल भाषा", value: "new", isoCode: "" },
  { label: "vèneto", value: "vec", isoCode: "" },
  { label: "Kreyòl ayisyen", value: "ht", isoCode: "" },
  { label: "پنجابی", value: "pnb", isoCode: "" },
  { label: "Piemontèis", value: "pms", isoCode: "" },
  { label: "башҡортса", value: "ba", isoCode: "" },
  { label: "Lëtzebuergesch", value: "lb", isoCode: "" },
  { label: "Sunda", value: "su", isoCode: "" },
  { label: "kurdî", value: "ku", isoCode: "" },
  { label: "Gaeilge", value: "ga", isoCode: "" },
  { label: "lombard", value: "lmo", isoCode: "" },
  { label: "ślůnski", value: "szl", isoCode: "" },
  { label: "íslenska", value: "is", isoCode: "" },
  { label: "Frysk", value: "fy", isoCode: "" },
  { label: "чӑвашла", value: "cv", isoCode: "" },
  { label: "کوردی", value: "ckb", isoCode: "" },
  { label: "ਪੰਜਾਬੀ", value: "pa", isoCode: "" },
  { label: "Tagalog", value: "tl", isoCode: "" },
  { label: "aragonés", value: "an", isoCode: "" },
  { label: "吴语", value: "wuu", isoCode: "" },
  { label: "Zazaki", value: "diq", isoCode: "" },
  { label: "Ido", value: "io", isoCode: "" },
  { label: "Scots", value: "sco", isoCode: "" },
  { label: "Volapük", value: "vo", isoCode: "" },
  { label: "Yorùbá", value: "yo", isoCode: "" },
  { label: "नेपाली", value: "ne", isoCode: "" },
  { label: "ગુજરાતી", value: "gu", isoCode: "" },
  { label: "ಕನ್ನಡ", value: "kn", isoCode: "" },
  { label: "Alemannisch", value: "als	", isoCode: "" },
  { label: "interlingua", value: "ia", isoCode: "" },
  { label: "Kotava", value: "avk", isoCode: "" },
  { label: "Boarisch", value: "bar", isoCode: "" },
  { label: "sicilianu", value: "scn", isoCode: "" },
  { label: "বিষ্ণুপ্রিয়া মণিপুরী", value: "bpy", isoCode: "" },
  { label: "Hausa", value: "ha", isoCode: "" },
  { label: "qırımtatarca", value: "crh", isoCode: "" },
  { label: "Runa Simi", value: "qu", isoCode: "" },
  { label: "монгол", value: "mn", isoCode: "" },
  { label: "Diné bizaad", value: "nv", isoCode: "" },
  { label: "მარგალური", value: "xmf", isoCode: "" },
  { label: "සිංහල", value: "si", isoCode: "" },
  { label: "Basa Bali", value: "ban", isoCode: "" },
  { label: "پښتو", value: "ps", isoCode: "" },
  { label: "žemaitėška", value: "bat-smg", isoCode: "" },
  { label: "Nordfriisk", value: "frr", isoCode: "" },
  { label: "ирон", value: "os", isoCode: "" },
  { label: "ଓଡ଼ିଆ", value: "or", isoCode: "" },
  { label: "саха тыла", value: "sah", isoCode: "" },
  { label: "閩東語 / Mìng-dĕ̤ng-ngṳ̄", value: "cdo", isoCode: "" },
  { label: "Gàidhlig", value: "gd", isoCode: "" },
  { label: "ᨅᨔ ᨕᨘᨁᨗ", value: "bug", isoCode: "" },
  { label: "ייִדיש", value: "yi", isoCode: "" },
  { label: "Ilokano", value: "ilo", isoCode: "" },
  { label: "سنڌي", value: "sd", isoCode: "" },
  { label: "አማርኛ", value: "am", isoCode: "" },
  { label: "Napulitano", value: "nap", isoCode: "" },
  { label: "مازِرونی", value: "mzn", isoCode: "" },
  { label: "Limburgs", value: "li", isoCode: "" },
  { label: "Bahasa Hulontalo", value: "gor", isoCode: "" },
  { label: "hornjoserbsce", value: "hsb", isoCode: "" },
  { label: "føroyskt", value: "fo", isoCode: "" },
  { label: "Basa Banyumasan", value: "map-bms", isoCode: "" },
  { label: "मैथिली", value: "mai", isoCode: "" },
  { label: "Igbo", value: "ig", isoCode: "" },
  { label: "Bikol Central", value: "bcl", isoCode: "" },
  { label: "emiliàn e rumagnòl", value: "eml", isoCode: "" },
  { label: "ၽႃႇသႃႇတႆး", value: "shn", isoCode: "" },
  { label: "Acèh", value: "ace", isoCode: "" },
  { label: "文言", value: "zh-classical", isoCode: "" },
  { label: "संस्कृतम्", value: "sa", isoCode: "" },
  { label: "walon", value: "wa", isoCode: "" },
  { label: "Interlingue", value: "ie", isoCode: "" },
  { label: "অসমীয়া", value: "as", isoCode: "" },
  { label: "Ligure", value: "lij", isoCode: "" },
  { label: "isiZulu", value: "zu", isoCode: "" },
  { label: "олык марий", value: "mhr", isoCode: "" },
  { label: "Արեւմտահայերէն", value: "hyw", isoCode: "" },
  { label: "Fiji Hindi", value: "hif", isoCode: "" },
  { label: "кырык мары", value: "mrj", isoCode: "" },
  { label: "chiShona", value: "sn", isoCode: "" },
  { label: "Banjar", value: "bjn", isoCode: "" },
  { label: "ꯃꯤꯇꯩ ꯂꯣꯟ", value: "mni", isoCode: "" },
  { label: "ភាសាខ្មែរ", value: "km", isoCode: "" },
  { label: "客家語/Hak-kâ-ngî", value: "hak", isoCode: "" },
  { label: "chiTumbuka", value: "tum", isoCode: "" },
  { label: "tarandíne", value: "roa-tara", isoCode: "" },
  { label: "Soomaaliga", value: "so", isoCode: "" },
  { label: "Kapampangan", value: "pam", isoCode: "" },
  { label: "русиньскый", value: "rue", isoCode: "" },
  { label: "Sesotho sa Leboa", value: "nso", isoCode: "" },
  { label: "भोजपुरी", value: "bh", isoCode: "" },
  { label: "ᱥᱟᱱᱛᱟᱲᱤ", value: "sat", isoCode: "" },
  { label: "davvisámegiella", value: "se", isoCode: "" },
  { label: "эрзянь", value: "myv", isoCode: "" },
  { label: "Māori", value: "mi", isoCode: "" },
  { label: "West-Vlams", value: "vls", isoCode: "" },
  { label: "Nedersaksies", value: "nds-nl", isoCode: "" },
  { label: "Nāhuatl", value: "nah", isoCode: "" },
  { label: "sardu", value: "sc", isoCode: "" },
  { label: "kernowek", value: "kw", isoCode: "" },
  { label: "گیلکی", value: "glk", isoCode: "" },
  { label: "vepsän kel’", value: "vep", isoCode: "" },
  { label: "Taqbaylit", value: "kab", isoCode: "" },
  { label: "Türkmençe", value: "tk", isoCode: "" },
  { label: "贛語", value: "gan", isoCode: "" },
  { label: "الدارجة", value: "ary", isoCode: "" },
  { label: "corsu", value: "co", isoCode: "" },
  { label: "dagbanli", value: "dag", isoCode: "" },
  { label: "võro", value: "fiu-vro", isoCode: "" },
  { label: "བོད་ཡིག", value: "bo", isoCode: "" },
  { label: "аԥсшәа", value: "ab", isoCode: "" },
  { label: "Gaelg", value: "gv", isoCode: "" },
  { label: "سرائیکی", value: "skr", isoCode: "" },
  { label: "arpetan", value: "frp", isoCode: "" },
  { label: "Zeêuws", value: "zea", isoCode: "" },
  { label: " ئۇيغۇرچە / Uyghurche", value: "ug", isoCode: "" },
  { label: "удмурт", value: "udm", isoCode: "" },
  { label: "Picard", value: "pcd", isoCode: "" },
  { label: "коми", value: "kv", isoCode: "" },
  { label: "kaszëbsczi", value: "csb", isoCode: "" },
  { label: "Ikinyarwanda", value: "rw", isoCode: "" },
  { label: "Malti", value: "mt", isoCode: "" },
  { label: "Avañe'ẽ", value: "gn", isoCode: "" },
  { label: "anarâškielâ", value: "smn", isoCode: "" },
  { label: "Aymar aru", value: "ay", isoCode: "" },
  { label: "Nouormand", value: "nrm", isoCode: "" },
  { label: "лезги", value: "lez", isoCode: "" },
  { label: "Lingua Franca Nova", value: "lfn", isoCode: "" },
  { label: "Seeltersk", value: "stq", isoCode: "" },
  { label: "livvinkarjala", value: "olo", isoCode: "" },
  { label: "ລາວ", value: "lo", isoCode: "" },
  { label: "Mirandés", value: "mwl", isoCode: "" },
  { label: "Ænglisc", value: "ang", isoCode: "" },
  { label: "furlan", value: "fur", isoCode: "" },
  { label: "rumantsch", value: "rm", isoCode: "" },
  { label: "Ladino", value: "lad", isoCode: "" },
  { label: "गोंयची कोंकणी / Gõychi Konknni", value: "gom", isoCode: "" },
  { label: "перем коми", value: "koi", isoCode: "" },
  { label: "estremeñu", value: "ext", isoCode: "" },
  { label: "тыва дыл", value: "tyv", isoCode: "" },
  { label: "dolnoserbski", value: "dsb", isoCode: "" },
  { label: "авар", value: "av", isoCode: "" },
  { label: "डोटेली", value: "dty", isoCode: "" },
  { label: "lingála", value: "ln", isoCode: "" },
  { label: "Qaraqalpaqsha", value: "kaa", isoCode: "" },
  { label: "Papiamentu", value: "pap", isoCode: "" },
  { label: "Chavacano de Zamboanga", value: "cbk-zam", isoCode: "" },
  { label: "ދިވެހިބަސް", value: "dv", isoCode: "" },
  { label: "Ripoarisch", value: "ksh", isoCode: "" },
  { label: "мокшень", value: "mdf", isoCode: "" },
  { label: "Gagauz", value: "gag", isoCode: "" },
  { label: "буряад", value: "bxr", isoCode: "" },
  { label: "कॉशुर / کٲشُر", value: "ks", isoCode: "" },
  { label: "Pälzisch", value: "pfl", isoCode: "" },
  { label: "Twi", value: "tw", isoCode: "" },
  { label: "Luganda", value: "lg", isoCode: "" },
  { label: "पालि", value: "pi", isoCode: "" },
  { label: "Vahcuengh", value: "za", isoCode: "" },
  { label: "Pangasinan", value: "pag", isoCode: "" },
  { label: "Sakizaya", value: "szy", isoCode: "" },
  { label: "Hawaiʻi", value: "haw", isoCode: "" },
  { label: "अवधी", value: "awa", isoCode: "" },
  { label: "Tayal", value: "tay", isoCode: "" },
  { label: "ပအိုဝ်ႏဘာႏသာႏ", value: "blk", isoCode: "" },
  { label: "гӀалгӀай", value: "inh", isoCode: "" },
  { label: "къарачай-малкъар", value: "krc", isoCode: "" },
  { label: "хальмг", value: "xal", isoCode: "" },
  { label: "Deitsch", value: "pdc", isoCode: "" },
  { label: "lea faka-Tonga", value: "to", isoCode: "" },
  { label: "Atikamekw", value: "atj", isoCode: "" },
  { label: "ܐܪܡܝܐ", value: "arc", isoCode: "" },
  { label: "ತುಳು", value: "tcy", isoCode: "" },
  { label: "ဘာသာ မန်", value: "mnw", isoCode: "" },
  { label: "Patois", value: "jam", isoCode: "" },
  { label: "Kabɩyɛ", value: "kbp", isoCode: "" },
  { label: "Dorerin Naoero", value: "na", isoCode: "" },
  { label: "Wolof", value: "wo", isoCode: "" },
  { label: "адыгэбзэ", value: "kbd", isoCode: "" },
  { label: "Li Niha", value: "nia", isoCode: "" },
  { label: "Novial", value: "nov", isoCode: "" },
  { label: "Gĩkũyũ", value: "ki", isoCode: "" },
  { label: "ߒߞߏ", value: "nqo", isoCode: "" },
  { label: "Taclḥit", value: "shi", isoCode: "" },
  { label: "Bislama", value: "bi", isoCode: "" },
  { label: "Tok Pisin", value: "tpi", isoCode: "" },
  { label: "tetun", value: "tet", isoCode: "" },
  { label: "la .lojban.", value: "jbo", isoCode: "" },
  { label: "armãneashti", value: "roa-rup", isoCode: "" },
  { label: "isiXhosa", value: "xh", isoCode: "" },
  { label: "Na Vosa Vakaviti", value: "fj", isoCode: "" },
  { label: "лакку", value: "lbe", isoCode: "" },
  { label: "Kongo", value: "kg", isoCode: "" },
  { label: "Oromoo", value: "om", isoCode: "" },
  { label: "gungbe", value: "guw", isoCode: "" },
  { label: "reo tahiti", value: "ty", isoCode: "" },
  { label: "словѣньскъ / ⰔⰎⰑⰂⰡⰐⰠⰔⰍⰟ", value: "cu", isoCode: "" },
  { label: "Seediq", value: "trv", isoCode: "" },
  { label: "Sranantongo", value: "srn", isoCode: "" },
  { label: "Gagana Samoa", value: "sm", isoCode: "" },
  { label: "kriyòl gwiyannen", value: "gcr", isoCode: "" },
  { label: "алтай тил", value: "alt", isoCode: "" },
  { label: "ᏣᎳᎩ", value: "chr", isoCode: "" },
  { label: "latgaļu", value: "ltg", isoCode: "" },
  { label: "Chi-Chewa", value: "ny", isoCode: "" },
  { label: "Setswana", value: "tn", isoCode: "" },
  { label: "Madhurâ", value: "mad", isoCode: "" },
  { label: "Sesotho", value: "st", isoCode: "" },
  { label: "Norfuk / Pitkern", value: "pih", isoCode: "" },
  { label: "𐌲𐌿𐍄𐌹𐍃𐌺", value: "got", isoCode: "" },
  { label: "eʋegbe", value: "ee", isoCode: "" },
  { label: "Pangcah", value: "ami", isoCode: "" },
  { label: "romani čhib", value: "rmy", isoCode: "" },
  { label: "bamanankan", value: "bm", isoCode: "" },
  { label: "Tshivenda", value: "ve", isoCode: "" },
  { label: "Fulfulde", value: "ff", isoCode: "" },
  { label: "Xitsonga", value: "ts", isoCode: "" },
  { label: "Tsetsêhestâhese", value: "chy", isoCode: "" },
  { label: "SiSwati", value: "ss", isoCode: "" },
  { label: "ikirundi", value: "rn", isoCode: "" },
  { label: "Tyap", value: "kcg", isoCode: "" },
  { label: "Naijá", value: "pcm", isoCode: "" },
  { label: "Akan", value: "ak", isoCode: "" },
  { label: "Chamoru", value: "ch", isoCode: "" },
  { label: "Iñupiatun", value: "ik", isoCode: "" },
  { label: "Ποντιακά", value: "pnt", isoCode: "" },
  { label: "wayuunaiki", value: "guc", isoCode: "" },
  { label: "адыгабзэ", value: "ady", isoCode: "" },
  { label: "ᐃᓄᒃᑎᑐᑦ / inuktitut", value: "iu", isoCode: "" },
  { label: "pinayuanan", value: "pwn", isoCode: "" },
  { label: "Sängö", value: "sg", isoCode: "" },
  { label: "Thuɔŋjäŋ", value: "din", isoCode: "" },
  { label: "ትግርኛ", value: "ti", isoCode: "" },
  { label: "kalaallisut", value: "kl", isoCode: "" },
  { label: "ཇོང་ཁ", value: "dz", isoCode: "" },
  { label: "farefare", value: "gur", isoCode: "" },
  { label: "Nēhiyawēwin / ᓀᐦᐃᔭᐍᐏᐣ", value: "cr", isoCode: "" },
].sort((a, b) => a.value.localeCompare(b.value));
