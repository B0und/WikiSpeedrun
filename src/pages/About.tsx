import { Link } from "@tanstack/react-router";
import { useI18nContext } from "../i18n/i18n-react";

const About = () => {
  const { LL } = useI18nContext();
  return (
    <>
      <h1 className="border-secondary-border border-b-[1px] font-serif text-3xl">{LL["Wiki Speedrun Game"]()}</h1>
      <p className="pt-4 pb-8">
        {LL[
          "The goal of the game is to navigate from a starting wikipedia article to another one, in the least amount of clicks and time"
        ]()}
      </p>
      <h2 className="border-secondary-border border-b-[1px] text-2xl">{LL.Features()}</h2>
      <ul className="flex list-inside list-disc flex-col gap-2 pt-4 pb-8 pl-4">
        <li>{LL["Now supports multiple languages"]()}</li>
        <li>{LL["No registration required"]()}</li>
        <li>
          {LL["High precision fair™ timer"]()}
          <ul className="list-inside list-[circle]">
            <li className="pl-6">{LL["actually stops while you are loading the next article"]()}</li>
          </ul>
        </li>
        <li> {LL["Keeps track of your session progress"]()}</li>
        <li> {LL["Dark theme support"]()}</li>
        <li> {LL["Open source"]()}</li>
      </ul>
      <Link to={"/settings"} className="bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
        {LL.Play()}
      </Link>
    </>
  );
};

export default About;
