import { useI18nContext } from "../i18n/i18n-react";

const NoMatch = () => {
  const { LL } = useI18nContext();
  return (
    <>
      <h3 className="border-b-[1px] border-secondary-border text-2xl">404</h3>
      <p className="pb-8 pt-4">{LL["This page doesn't exist"]()}</p>
    </>
  );
};

export default NoMatch;
