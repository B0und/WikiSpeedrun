import { Link } from "@tanstack/react-router";
import { useLingui } from "@lingui/react";

const About = () => {
  const { _: t } = useLingui();
  return (
    <>
      <h1 className="border-secondary-border border-b-[1px] font-serif text-3xl">{t("Wiki Speedrun Game")}</h1>
      <p className="pt-4 pb-8">
        {t(
          "The goal of the game is to navigate from a starting wikipedia article to another one, in the least amount of clicks and time",
        )}
      </p>
      <h2 className="border-secondary-border border-b-[1px] text-2xl">{t("Features")}</h2>
      <ul className="flex list-inside list-disc flex-col gap-2 pt-4 pb-8 pl-4">
        <li>{t("Now supports multiple languages")}</li>
        <li>{t("No registration required")}</li>
        <li>
          {t("High precision fair™ timer")}
          <ul className="list-inside list-[circle]">
            <li className="pl-6">{t("actually stops while you are loading the next article")}</li>
          </ul>
        </li>
        <li> {t("Keeps track of your session progress")}</li>
        <li> {t("Dark theme support")}</li>
        <li> {t("Open source")}</li>
      </ul>
      <Link to={"/settings"} className="bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
        {t("Play")}
      </Link>
    </>
  );
};

export default About;
