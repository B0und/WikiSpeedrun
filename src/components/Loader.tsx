import { useTranslation } from "../lingui";

export const Loader = () => {
  const t = useTranslation();

  return (
    <p aria-live="assertive" role="status" data-testid="loading">
      {t("Loading")}
    </p>
  );
};
