import { useLingui } from "@lingui/react";

export const Loader = () => {
  const { _: t } = useLingui();

  return (
    <output aria-live="assertive" data-testid="loading" className="block">
      {t("Loading")}
    </output>
  );
};
