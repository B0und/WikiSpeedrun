import { Link } from "react-router-dom";
import { GitHub, Moon, Sun } from "react-feather";
import { ResultDialog } from "./ResultDialog";
import { useThemeContext } from "./ThemeContext";
import { useIsGameRunning } from "../stores/GameStore";
import { GiveUpModal } from "./ConfirmNavigation";
import { useI18nContext } from "../i18n/i18n-react";
import { InterfaceLanguageSelect } from "./InterfaceLanguageSelect";
import { LocalizedString } from "typesafe-i18n";
import { MobileMenu } from "./MobileMenu";

export interface Link {
  name: LocalizedString;
  path: string;
}
const Header = () => {
  const { LL } = useI18nContext();

  const links: Link[] = [
    { name: LL.Play(), path: "/settings" },
    { name: LL.Statistics(), path: "/stats" },
    { name: LL.Achievements(), path: "/achievements" },
    { name: LL.About(), path: "/about" },
  ];

  const isGameRunning = useIsGameRunning();

  const { colorMode, switchTheme } = useThemeContext();

  return (
    <div className="flex items-center gap-12 border-b-[2px] border-secondary-blue pb-3 sm:gap-0">
      <WikiLogo />
      <nav className="flex h-full flex-1 items-center gap-4">
        <div className="flex gap-4 sm:hidden">
          <LeftNav isGameRunning={isGameRunning} links={links} />
        </div>
        {isGameRunning && <GiveUpModal />}
        <MobileMenu links={links} />
        <ResultDialog />
        <ul className="ml-auto flex h-full gap-4 ">
          {!isGameRunning && <InterfaceLanguageSelect />}
          <li className="h-full">
            <button
              className="flex h-full w-12 items-center justify-center hover:text-primary-blue"
              onClick={switchTheme}
            >
              {colorMode === "light" ? <Sun /> : <Moon />}
            </button>
          </li>
          <li className="h-full sm:hidden">
            <GithubLink />
          </li>
        </ul>
      </nav>
    </div>
  );
};

const WikiLogo = () => {
  const { LL } = useI18nContext();
  const { colorMode } = useThemeContext();
  const imageSrc = colorMode === "light" ? "/new-wiki-logo-light" : "/new-wiki-logo-dark";

  return (
    <picture className="basis-[200px] sm:hidden">
      <source srcSet={window.location.origin + `/${imageSrc}.webp`} type="image/webp" />

      <source srcSet={window.location.origin + `/${imageSrc}.png`} type="image/png" />
      <img
        className="block h-full"
        src={window.location.origin + `/${imageSrc}.png`}
        alt={LL[
          "Wiki speedrun logo, featuring a Wikipedia sphere with a timer across i (looks like a big black stripe with a green time text on top) The time is 9 seconds and 5 milliseconds"
        ]()}
      />
    </picture>
  );
};

const LeftNav = ({ isGameRunning, links }: { isGameRunning: boolean; links: Link[] }) => {
  return (
    <>
      {!isGameRunning &&
        links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="w-full whitespace-nowrap p-4 hover:text-primary-blue focus-visible:text-primary-blue"
          >
            {link.name}
          </Link>
        ))}
    </>
  );
};

export const GithubLink = () => {
  return (
    <a
      target="_blank"
      href="https://github.com/B0und/WikiSpeedrun"
      className="flex h-full w-12 items-center justify-center hover:text-primary-blue"
      rel="noreferrer"
    >
      <GitHub />
    </a>
  );
};

export default Header;
