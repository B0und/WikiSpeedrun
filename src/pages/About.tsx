import { Link } from "@tanstack/react-router";
import { useLingui } from "@lingui/react/macro";

const About = () => {
  const { t } = useLingui();
  return (
    <>
      <h1 className="border-b-[1px] border-secondary-border font-serif text-3xl">
        {t({ id: "Wiki Speedrun Game" })}
      </h1>
      <p className="pt-4 pb-8">
        {t({
          id: "The goal of the game is to navigate from a starting wikipedia article to another one, in the least amount of clicks and time",
        })}
      </p>
      <h2 className="border-b-[1px] border-secondary-border text-2xl">{t({ id: "Features" })}</h2>
      <ul className="flex list-inside list-disc flex-col gap-2 pt-4 pb-8 pl-4">
        <li>{t({ id: "Now supports multiple languages" })}</li>
        <li>{t({ id: "No registration required" })}</li>
        <li>
          {t({ id: "High precision fair™ timer" })}
          <ul className="list-inside list-[circle]">
            <li className="pl-6">
              {t({ id: "actually stops while you are loading the next article" })}
            </li>
          </ul>
        </li>
        <li> {t({ id: "Keeps track of your session progress" })}</li>
        <li> {t({ id: "Dark theme support" })}</li>
        <li> {t({ id: "Open source" })}</li>
      </ul>
      <Link to={"/settings"} className="bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
        {t({ id: "Play" })}
      </Link>
    </>
  );
};

export default About;
