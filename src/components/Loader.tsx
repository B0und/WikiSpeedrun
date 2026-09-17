import { useI18nContext } from "../i18n/i18n-react";

export const Loader = () => {
  const { LL } = useI18nContext();

  return (
    <p aria-live="assertive" data-testid="loading">
      {LL.Loading()}
    </p>
  );
};
