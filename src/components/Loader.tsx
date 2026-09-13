import { useTranslation } from "../lingui";

export const Loader = () => {
  const t = useTranslation();

  return (
    <output aria-live="assertive" data-testid="loading" className="block">
      {t("Loading")}
    </output>
  );
};
