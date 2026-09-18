import type { StylesConfig } from "react-select";

/**
 * react-select styles its parts with emotion, whose stylesheets are unlayered.
 * Tailwind 4 emits utilities into real cascade layers, and unlayered styles
 * always beat layered ones — so `dark:*` utilities cannot override react-select
 * in dark mode (Tailwind 3 used specificity instead of layers and could). The
 * dark theme therefore has to be applied through the `styles` API, which
 * injects unlayered emotion rules of its own.
 */

const DARK_SURFACE = "var(--color-dark-surface)";
const DARK_SURFACE_SECONDARY = "var(--color-dark-surface-secondary)";
const DARK_PRIMARY = "var(--color-dark-primary)";
const PRIMARY_BLUE = "var(--color-primary-blue)";
const LIGHT_CONTROL = "#fafafa";
const ACCENT = "hsla(203, 66%, 56%)";

export interface ReactSelectStylesOptions {
  isDarkMode: boolean;
  controlMaxWidth?: string;
  menuWidth?: string;
}

export const reactSelectStyles = <Option>({
  isDarkMode,
  controlMaxWidth,
  menuWidth,
}: ReactSelectStylesOptions): StylesConfig<Option> => ({
  control: (base) => ({
    ...base,
    ...(controlMaxWidth ? { maxWidth: controlMaxWidth } : {}),
    backgroundColor: isDarkMode ? DARK_SURFACE : LIGHT_CONTROL,
    color: isDarkMode ? DARK_PRIMARY : undefined,
    "&:hover": {
      borderColor: ACCENT,
    },
    "&:focus": {
      boxShadow: `0 0 0 1px ${ACCENT}`,
    },
  }),
  menu: (base) => ({
    ...base,
    ...(menuWidth ? { width: menuWidth } : {}),
    backgroundColor: isDarkMode ? DARK_SURFACE_SECONDARY : base.backgroundColor,
    color: isDarkMode ? DARK_PRIMARY : base.color,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: !isDarkMode
      ? base.backgroundColor
      : state.isFocused
        ? "#464242"
        : DARK_SURFACE_SECONDARY,
    color: !isDarkMode ? base.color : state.isFocused ? PRIMARY_BLUE : DARK_PRIMARY,
  }),
  input: (base) => (isDarkMode ? { ...base, color: DARK_PRIMARY } : base),
  singleValue: (base) => (isDarkMode ? { ...base, color: DARK_PRIMARY } : base),
  loadingMessage: (base) =>
    isDarkMode ? { ...base, backgroundColor: DARK_SURFACE_SECONDARY, color: DARK_PRIMARY } : base,
  noOptionsMessage: (base) =>
    isDarkMode ? { ...base, backgroundColor: DARK_SURFACE_SECONDARY, color: DARK_PRIMARY } : base,
});
