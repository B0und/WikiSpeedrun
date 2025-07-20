import { useI18nContext } from "../i18n/i18n-react";

export const Loader = () => {
  const { LL } = useI18nContext();

  return (
    <p aria-live="assertive" role="status" data-testid="loading">
      {LL.Loading()}
    </p>
  );
};
