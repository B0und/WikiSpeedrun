import { useLingui } from "@lingui/react/macro";

export const Loader = () => {
  const { t } = useLingui();

  return (
    <output aria-live="assertive" data-testid="loading" className="block">
      {t({ id: "Loading" })}
    </output>
  );
};
