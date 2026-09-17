import { Link } from "@tanstack/react-router";
import { Menu } from "react-feather";
import { useLingui } from "@lingui/react/macro";
import { useIsGameRunning } from "../stores/GameStore";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./Drawer";
import { GithubLink, type WikiLink } from "./Header";

export const MobileMenu = ({ links }: { links: WikiLink[] }) => {
  const { t } = useLingui();
  const isGameRunning = useIsGameRunning();

  return (
    <div className="hidden md:block">
      <Drawer>
        <DrawerTrigger asChild>
          {!isGameRunning && (
            <button
              type="button"
              aria-label={t({ id: "Menu", message: "Menu", comment: "Button that opens the mobile navigation drawer" })}
              className="-ml-3 bg-inherit p-3 hover:text-primary-blue focus-visible:text-primary-blue "
            >
              <Menu />
            </button>
          )}
        </DrawerTrigger>
        <DrawerContent side="left" className="flex flex-col items-start">
          <nav className="-ml-4 flex w-full flex-1 flex-col justify-center gap-2">
            {!isGameRunning &&
              links.map((link) => (
                <DrawerClose key={link.path} asChild>
                  <Link to={link.path} className="w-full p-4 hover:text-primary-blue focus-visible:text-primary-blue">
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
