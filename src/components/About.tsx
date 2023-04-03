import { Link } from "react-router-dom";
import { useI18nContext } from "../i18n/i18n-react";

const About = () => {
  const { LL } = useI18nContext();
  return (
    <>
      <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl">{LL.TITLE()}</h2>
      <p className="pb-8 pt-4">{LL.GAME_DESCRIPTION()}</p>
      <h3 className="border-b-[1px] border-secondary-border text-2xl">{LL.FEATURES()}</h3>
      <ul className="flex list-inside list-disc flex-col gap-2 pb-8 pl-4 pt-4">
        <li>{LL.MULTIPLE_LANGUAGES()}</li>
        <li>{LL.NO_REGISTRATION()}</li>
        <li>
          {LL.TIMER_DESCRIPTION()}
          <ul className="list-inside list-[circle]">
            <li className="pl-6"> {LL.TIMER_SUB_DESCRIPTION()}</li>
          </ul>
        </li>
        <li> {LL.SESSION_PROGRESS()}</li>
        <li> {LL.DARK_THEME()}</li>
        <li> {LL.OPEN_SOURCE()}</li>
      </ul>
      <Link to={"/settings"} className="bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
        {LL.PLAY()}
      </Link>
    </>
  );
};

export default About;
