import React from 'react';
import { Link } from 'react-router-dom';
import { X, GitHub, Moon, Sun } from 'react-feather';

const links = [
  { name: 'Play', path: '/settings' },
  { name: 'About', path: '/about' },
];

const Header = () => {
  const theme = 'light';

  const imageSrc = theme === 'light' ? '/new-wiki-logo-light' : '/new-wiki-logo-dark';
  return (
    <div className="flex items-center gap-12 border-b-[2px] border-secondary-blue pb-3">
      <picture className="basis-[200px]">
        <source srcSet={window.location.origin + `/${imageSrc}.webp`} type="image/webp" />

        <source srcSet={window.location.origin + `/${imageSrc}.png`} type="image/png" />
        <img
          className="block h-full"
          src={window.location.origin + `/${imageSrc}.png`}
          alt="Wiki speedrun logo, featuring a Wikipedia sphere with a timer across it. (looks like a big black stripe with a green time text on top)"
        />
      </picture>
      <nav className="flex h-full flex-1 items-center gap-4">
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="p-4 hover:text-primary-blue">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="ml-auto flex h-full gap-4">
          <li className="h-full">
            <button className="flex h-full w-12 items-center justify-center hover:text-primary-blue">
              {theme === 'light' ? <Sun /> : <Moon />}
            </button>
          </li>
          <li className="h-full">
            <a
              href="#"
              className="flex  h-full w-12 items-center justify-center hover:text-primary-blue"
            >
              <GitHub />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
// hsla(203, 66%, 56%)

export default Header;
