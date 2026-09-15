import { useLingui } from "@lingui/react";

const NoMatch = () => {
  const { _: t } = useLingui();
  return (
    <>
      <h3 className="border-secondary-border border-b-[1px] text-2xl">404</h3>
      <p className="pt-4 pb-8">{t("This page doesn't exist")}</p>
    </>
  );
};

export default NoMatch;
