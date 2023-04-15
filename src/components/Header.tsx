import { Link } from "react-router-dom";
import { GitHub, Menu, Moon, Sun } from "react-feather";
import { ResultDialog } from "./ResultDialog";
import { useThemeContext } from "./ThemeContext";
import { useIsGameRunning } from "../GameStore";
import { GiveUpModal } from "./ConfirmNavigation";
import { useI18nContext } from "../i18n/i18n-react";
import { InterfaceLanguageSelect } from "./InterfaceLanguageSelect";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "./Drawer";
import { LocalizedString } from "typesafe-i18n";

interface Link {
  name: LocalizedString;
  path: string;
}
const Header = () => {
  const { LL } = useI18nContext();

  const links = [
    { name: LL.PLAY(), path: "/settings" },
    { name: LL.ABOUT(), path: "/about" },
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

const MobileMenu = ({ links }: { links: Link[] }) => {
  const { LL } = useI18nContext();

  const isGameRunning = useIsGameRunning();

  return (
    <div className="hidden sm:block">
      <Drawer>
        <DrawerTrigger asChild>
          {!isGameRunning && (
            <button
              type="button"
              aria-label="Menu"
              className="-ml-3 bg-inherit p-3  hover:text-primary-blue focus-visible:text-primary-blue "
            >
              <Menu />
            </button>
          )}
        </DrawerTrigger>
        <DrawerContent side="left" className="flex flex-col items-start">
          <h3 className="w-full border-b-[1px] border-secondary-border text-xl ">
            {LL.NAVIGATION()}
          </h3>
          <nav className=" -ml-4 mt-4 flex w-full flex-col gap-2">
            {!isGameRunning &&
              links.map((link) => (
                <DrawerClose key={link.path} asChild>
                  <Link
                    to={link.path}
                    className="w-full p-4 hover:text-primary-blue focus-visible:text-primary-blue"
                  >
                    {link.name}
                  </Link>
                </DrawerClose>
              ))}
          </nav>
          <div className="mt-auto">
            <GithubLink />
          </div>
        </DrawerContent>
      </Drawer>
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
        alt={LL.WIKI_ALT_TEXT()}
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

const GithubLink = () => {
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
