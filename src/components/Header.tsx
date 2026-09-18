import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Link } from "@tanstack/react-router";
import { GitHub, Moon, Sun } from "react-feather";
import { useLingui } from "@lingui/react/macro";
import { useIsGameRunning } from "../stores/GameStore";
import { GiveUpModal } from "./ConfirmNavigation";
import { InterfaceLanguageSelect } from "./InterfaceLanguageSelect";
import { MobileMenu } from "./MobileMenu";
import { ResultDialog } from "./ResultDialog";
import { WikiPresentationMenu } from "./Wiki/WikiPresentationMenu";
import { useThemeContext } from "./ThemeContext";

export interface WikiLink {
  name: string;
  path: string;
}
const Header = () => {
  const { t } = useLingui();

  const links: WikiLink[] = [
    { name: t({ id: "Play" }), path: "/settings" },
    { name: t({ id: "Statistics" }), path: "/stats" },
    { name: t({ id: "Achievements" }), path: "/achievements" },
    { name: t({ id: "About" }), path: "/about" },
  ];

  const isGameRunning = useIsGameRunning();

  const { colorMode, switchTheme } = useThemeContext();

  return (
    <div className="flex items-center gap-12 border-b-[2px] border-secondary-blue pb-3 sm:gap-0">
      <WikiLogo />
      <nav className="flex h-full flex-1 items-center gap-4">
        <div className="flex gap-4 lg:hidden">
          <LeftNav isGameRunning={isGameRunning} links={links} />
        </div>
        {isGameRunning && <GiveUpModal />}
        <MobileMenu links={links} />
        <ResultDialog />
        <ul className="ml-auto flex h-full shrink-0 gap-4">
          <li className="h-full">{!isGameRunning && <InterfaceLanguageSelect />}</li>
          <li className="h-full">
            <WikiPresentationMenu />
          </li>
          <li className="h-full">
            <button
              type="button"
              className="flex h-full w-12 items-center justify-center hover:text-primary-blue"
              onClick={switchTheme}
            >
              {colorMode === "light" ? <Sun /> : <Moon />}
              <VisuallyHidden>
                {t({
                  id: "Toggle theme",
                  message: "Toggle theme",
                  comment: "Button that switches between light and dark mode",
                })}
              </VisuallyHidden>
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
  const { t } = useLingui();
  const { colorMode } = useThemeContext();
  const imageSrc = colorMode === "light" ? "/new-wiki-logo-light" : "/new-wiki-logo-dark";

  return (
    <picture className="shrink-0 basis-[200px] md:hidden">
      <source srcSet={`${window.location.origin}/${imageSrc}.webp`} type="image/webp" />

      <source srcSet={`${window.location.origin}/${imageSrc}.png`} type="image/png" />
      <img
        width={200}
        height={68}
        className="block h-full"
        src={`${window.location.origin}/${imageSrc}.png`}
        alt={t({
          id: "Wiki speedrun logo, featuring a Wikipedia sphere with a timer across i (looks like a big black stripe with a green time text on top) The time is 9 seconds and 5 milliseconds",
        })}
      />
    </picture>
  );
};

const LeftNav = ({ isGameRunning, links }: { isGameRunning: boolean; links: WikiLink[] }) => {
  return (
    <>
      {!isGameRunning &&
        links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="w-full p-4 whitespace-nowrap hover:text-primary-blue focus-visible:text-primary-blue"
          >
            {link.name}
          </Link>
        ))}
    </>
  );
};

export const GithubLink = () => {
  const { t } = useLingui();
  return (
    <a
      target="_blank"
      href="https://github.com/B0und/WikiSpeedrun"
      className="flex h-full w-12 items-center justify-center hover:text-primary-blue"
      rel="noreferrer"
    >
      <GitHub />
      <VisuallyHidden>
        {t({
          id: "Source code on github",
          message: "Source code on github",
          comment: "Link to the project's GitHub repository",
        })}
      </VisuallyHidden>
    </a>
  );
};

export default Header;
