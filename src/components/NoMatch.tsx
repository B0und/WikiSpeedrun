import { useLingui } from "@lingui/react/macro";

const NoMatch = () => {
  const { t } = useLingui();
  return (
    <>
      <h3 className="border-b-[1px] border-secondary-border text-2xl">404</h3>
      <p className="pt-4 pb-8">{t({ id: "This page doesn't exist" })}</p>
    </>
  );
};

export default NoMatch;
