import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Autocomplete, AutocompleteOption } from './AutocompleteOld';

const About = () => {
  return (
    <>
      <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl">
        Wiki Speedrun Game
      </h2>
      <p className="pt-4 pb-8">
        The goal of the game is to navigate from a starting wikipedia article to another one, in the
        least amount of clicks and time.
      </p>
      <h3 className="border-b-[1px] border-secondary-border text-2xl">Features</h3>
      <ul className="flex list-inside list-disc flex-col gap-2 pt-4 pb-8 pl-4">
        <li>No registration required</li>
        <li>
          High precision fair™ timer
          <ul className="list-inside list-[circle]">
            <li className="pl-6">actually stops while you are loading the next article</li>
          </ul>
        </li>
        <li>Keeps track of your session progress</li>
        <li>Dark theme support</li>
        <li>Open source</li>
      </ul>
      <Link to={'/settings'} className="bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
        Play
      </Link>
    </>
  );
};

export default About;
