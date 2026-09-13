import type { Messages } from "@lingui/core";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { messages as englishMessages } from "./locales/en/messages.po";

export const SUPPORTED_LOCALES = [
  "de",
  "en",
  "es",
  "fr",
  "gr",
  "hi",
  "id",
  "it",
  "jp",
  "nl",
  "pl",
  "ru",
  "se",
  "vi",
  "zh",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const messageDescriptors = {
  "Wiki Speedrun Game": msg({ id: "Wiki Speedrun Game", message: "Wiki Speedrun Game" }),
  "The goal of the game is to navigate from a starting wikipedia article to another one, in the least amount of clicks and time":
    msg({
      id: "The goal of the game is to navigate from a starting wikipedia article to another one, in the least amount of clicks and time",
      message:
        "The goal of the game is to navigate from a starting wikipedia article to another one, in the least amount of clicks and time.",
    }),
  Features: msg({ id: "Features", message: "Features" }),
  "Now supports multiple languages": msg({
    id: "Now supports multiple languages",
    message: "Now supports multiple languages",
  }),
  "No registration required": msg({ id: "No registration required", message: "No registration required" }),
  "High precision fair™ timer": msg({ id: "High precision fair™ timer", message: "High precision fair™ timer" }),
  "actually stops while you are loading the next article": msg({
    id: "actually stops while you are loading the next article",
    message: "actually stops while you are loading the next article",
  }),
  "Keeps track of your session progress": msg({
    id: "Keeps track of your session progress",
    message: "Keeps track of your session progress",
  }),
  "Dark theme support": msg({ id: "Dark theme support", message: "Dark theme support" }),
  "Open source": msg({ id: "Open source", message: "Open source" }),
  Play: msg({ id: "Play", message: "Play" }),
  About: msg({ id: "About", message: "About" }),
  Settings: msg({ id: "Settings", message: "Settings" }),
  "Start typing and then select values from the dropdown list or press the random button": msg({
    id: "Start typing and then select values from the dropdown list or press the random button",
    message: "Start typing and then select values from the dropdown list or press the random button.",
  }),
  "Select starting article": msg({ id: "Select starting article", message: "Select starting article" }),
  "Select ending article": msg({ id: "Select ending article", message: "Select ending article" }),
  "Start typing to see options": msg({ id: "Start typing to see options", message: "Start typing to see options" }),
  "Article clicks": msg({ id: "Article clicks", message: "Article clicks" }),
  "Cheating attempts": msg({ id: "Cheating attempts", message: "Cheating attempts" }),
  Results: msg({ id: "Results", message: "Results" }),
  "Play again": msg({ id: "Play again", message: "Play again" }),
  "Give up": msg({ id: "Give up", message: "Give up" }),
  "Confirm action": msg({ id: "Confirm action", message: "Confirm action" }),
  "If you leave, your current progress will be lost": msg({
    id: "If you leave, your current progress will be lost",
    message: "If you leave, your current progress will be lost",
  }),
  History: msg({ id: "History", message: "History" }),
  Article: msg({ id: "Article", message: "Article" }),
  Time: msg({ id: "Time", message: "Time" }),
  "This page doesn't exist": msg({ id: "This page doesn't exist", message: "This page doesn't exist" }),
  "Clicks: {0}": msg({ id: "Clicks: {0}", message: "Clicks: {0}" }),
  "No articles found": msg({ id: "No articles found", message: "No articles found" }),
  "Get random article": msg({ id: "Get random article", message: "Get random article" }),
  "Wiki speedrun logo, featuring a Wikipedia sphere with a timer across i (looks like a big black stripe with a green time text on top) The time is 9 seconds and 5 milliseconds":
    msg({
      id: "Wiki speedrun logo, featuring a Wikipedia sphere with a timer across i (looks like a big black stripe with a green time text on top) The time is 9 seconds and 5 milliseconds",
      message:
        "Wiki speedrun logo, featuring a Wikipedia sphere with a timer across it. (looks like a big black stripe with a green time text on top). The time is 9 seconds and 5 milliseconds.",
    }),
  "Select article language": msg({ id: "Select article language", message: "Select article language" }),
  Language: msg({ id: "Language", message: "Language" }),
  Navigation: msg({ id: "Navigation", message: "Navigation" }),
  "No Cheating!": msg({ id: "No Cheating!", message: "No Cheating!" }),
  "Random failed, try again": msg({ id: "Random failed, try again", message: "Random failed, try again" }),
  "Choose another link": msg({ id: "Choose another link", message: "Choose another link" }),
  "Share settings": msg({ id: "Share settings", message: "Share settings" }),
  "Copied to clipboard": msg({ id: "Copied to clipboard", message: "Copied to clipboard" }),
  "Share Result": msg({ id: "Share Result", message: "Share Result" }),
  Loading: msg({ id: "Loading", message: "Loading..." }),
  "Couldn't load article preview": msg({
    id: "Couldn't load article preview",
    message: "Couldn't load article preview",
  }),
  "Winning links": msg({ id: "Winning links", message: "Winning links" }),
  "Missed wins": msg({ id: "Missed wins", message: "Missed wins" }),
  "Choose your article": msg({ id: "Choose your article", message: "Choose your article" }),
  Statistics: msg({ id: "Statistics", message: "Statistics" }),
  "Wins:": msg({ id: "Wins:", message: "Wins:" }),
  "Total games:": msg({ id: "Total games:", message: "Total games:" }),
  "Known languages:": msg({ id: "Known languages:", message: "Known languages:" }),
  "Random choices:": msg({ id: "Random choices:", message: "Random choices:" }),
  "Articles clicked:": msg({ id: "Articles clicked:", message: "Articles clicked:" }),
  "Previewed Articles:": msg({ id: "Previewed Articles:", message: "Previewed Articles:" }),
  Achievements: msg({ id: "Achievements", message: "Achievements" }),
  "All of the information is stored locally in your browser (because servers cost money)": msg({
    id: "All of the information is stored locally in your browser (because servers cost money)",
    message: "All of the information is stored locally in your browser (because servers cost money)",
  }),
  "If you clear your browser data or switch to another browser all of your data will be gone": msg({
    id: "If you clear your browser data or switch to another browser all of your data will be gone",
    message: "If you clear your browser data or switch to another browser all of your data will be gone.",
  }),
  "FirstWin.title": msg({ id: "FirstWin.title", message: "First Victory" }),
  "FirstWin.description": msg({ id: "FirstWin.description", message: "Complete your first speedrun" }),
  "NoviceRunner.title": msg({ id: "NoviceRunner.title", message: "Novice Runner" }),
  "NoviceRunner.description": msg({ id: "NoviceRunner.description", message: "Win 10 games" }),
  "Speedster.title": msg({ id: "Speedster.title", message: "Speedster" }),
  "Speedster.description": msg({ id: "Speedster.description", message: "Win 25 games" }),
  "WikiExplorer.title": msg({ id: "WikiExplorer.title", message: "Wiki Explorer" }),
  "WikiExplorer.description": msg({ id: "WikiExplorer.description", message: "Win 50 games" }),
  "SpeedDemon.title": msg({ id: "SpeedDemon.title", message: "Speed Demon" }),
  "SpeedDemon.description": msg({ id: "SpeedDemon.description", message: "Win 100 games" }),
  "MasterRunner.title": msg({ id: "MasterRunner.title", message: "Master Runner" }),
  "MasterRunner.description": msg({ id: "MasterRunner.description", message: "Win 250 games" }),
  "WikipediaChampion.title": msg({ id: "WikipediaChampion.title", message: "Wikipedia Champion" }),
  "WikipediaChampion.description": msg({ id: "WikipediaChampion.description", message: "Win 500 games" }),
  "SpeedrunAddict.title": msg({ id: "SpeedrunAddict.title", message: "Speedrun Addict" }),
  "SpeedrunAddict.description": msg({ id: "SpeedrunAddict.description", message: "Win 1000 games" }),
  "WikipediaLegend.title": msg({ id: "WikipediaLegend.title", message: "Wikipedia Legend" }),
  "WikipediaLegend.description": msg({ id: "WikipediaLegend.description", message: "Win 2500 games" }),
  "SpeedrunGod.title": msg({ id: "SpeedrunGod.title", message: "Speedrun God" }),
  "SpeedrunGod.description": msg({ id: "SpeedrunGod.description", message: "Win 5000 games" }),
  "AttentiveExplorer.title": msg({ id: "AttentiveExplorer.title", message: "Attentive Explorer" }),
  "AttentiveExplorer.description": msg({
    id: "AttentiveExplorer.description",
    message: "Navigate through at least 10 articles without missing the winning link",
  }),
  "KeenPathfinder.title": msg({ id: "KeenPathfinder.title", message: "Keen Pathfinder" }),
  "KeenPathfinder.description": msg({
    id: "KeenPathfinder.description",
    message: "Navigate through at least 25 articles without missing the winning link",
  }),
  "SharpNavigator.title": msg({ id: "SharpNavigator.title", message: "Sharp Navigator" }),
  "SharpNavigator.description": msg({
    id: "SharpNavigator.description",
    message: "Navigate through at least 50 articles without missing the winning link",
  }),
  "ExplorerOfChance.title": msg({ id: "ExplorerOfChance.title", message: "Explorer of Chance" }),
  "ExplorerOfChance.description": msg({ id: "ExplorerOfChance.description", message: "Select 10 random articles" }),
  "FortuneSeeker.title": msg({ id: "FortuneSeeker.title", message: "Fortune Seeker" }),
  "FortuneSeeker.description": msg({ id: "FortuneSeeker.description", message: "Select 100 random articles" }),
  "GachaAddict.title": msg({ id: "GachaAddict.title", message: "Gacha Addict" }),
  "GachaAddict.description": msg({ id: "GachaAddict.description", message: "Select 1000 random articles" }),
  "GachaOverlord.title": msg({ id: "GachaOverlord.title", message: "Gacha Overlord" }),
  "GachaOverlord.description": msg({ id: "GachaOverlord.description", message: "Select 10000 random articles" }),
  "Curiosity.title": msg({ id: "Curiosity.title", message: "Curiosity didn't kill the cat" }),
  "Curiosity.description": msg({ id: "Curiosity.description", message: "Preview an article" }),
  "CuriousExplorer.title": msg({ id: "CuriousExplorer.title", message: "Curious Explorer" }),
  "CuriousExplorer.description": msg({ id: "CuriousExplorer.description", message: "Preview 100 articles" }),
  "PreviewEnthusiast.title": msg({ id: "PreviewEnthusiast.title", message: "Preview Enthusiast" }),
  "PreviewEnthusiast.description": msg({ id: "PreviewEnthusiast.description", message: "Preview 1000 articles" }),
  "InsatiablesReader.title": msg({ id: "InsatiablesReader.title", message: "Insatiable Reader" }),
  "InsatiablesReader.description": msg({ id: "InsatiablesReader.description", message: "Preview 10000 articles" }),
  "Bilingual.title": msg({ id: "Bilingual.title", message: "Bilingual" }),
  "Bilingual.description": msg({ id: "Bilingual.description", message: "Explore articles in 2 different languages" }),
  "Trilingual.title": msg({ id: "Trilingual.title", message: "Trilingual" }),
  "Trilingual.description": msg({ id: "Trilingual.description", message: "Explore articles in 3 different languages" }),
  "Polyglot.title": msg({ id: "Polyglot.title", message: "Polyglot" }),
  "Polyglot.description": msg({ id: "Polyglot.description", message: "Explore articles in 5 different languages" }),
  "EgoStroke.title": msg({ id: "EgoStroke.title", message: "Ego Stroke" }),
  "EgoStroke.description": msg({ id: "EgoStroke.description", message: "Thank you for inspiring this whole project" }),
  "SpeedrunWaifu.title": msg({ id: "SpeedrunWaifu.title", message: "Wiki Speedrun Waifu" }),
  "SpeedrunWaifu.description": msg({
    id: "SpeedrunWaifu.description",
    message: "Made by Ina_den. Follow him on twitter",
  }),
  "Made by Ina_den": msg({ id: "Made by Ina_den", message: "Made by Ina_den." }),
  "Follow him on": msg({ id: "Follow him on", message: "Follow him on" }),
  "twitter (X)": msg({ id: "twitter (X)", message: " twitter (X)" }),
  "Achievement unlocked": msg({ id: "Achievement unlocked", message: "Achievement unlocked" }),
  WaifuAlt: msg({
    id: "WaifuAlt",
    message:
      "Cute anime girl with a blue dress sitting in a library, while a wikipedia globe with a speedrun timer attached is floating nearby",
  }),
  "Prize trophy": msg({ id: "Prize trophy", message: "Prize Trophy" }),
  "Enable search during gameplay": msg({
    id: "Enable search during gameplay",
    message: "Enable search during gameplay",
  }),
  Yes: msg({ id: "Yes", message: "Yes" }),
  No: msg({ id: "No", message: "No" }),
} as const;

export type MessageId = keyof typeof messageDescriptors;
export type Translate = (id: MessageId, values?: Record<string, string | number>) => string;

type CatalogModule = { messages: Messages };

const localeLoaders: Record<Locale, () => Promise<CatalogModule>> = {
  de: () => import("./locales/de/messages.po"),
  en: async () => ({ messages: englishMessages }),
  es: () => import("./locales/es/messages.po"),
  fr: () => import("./locales/fr/messages.po"),
  gr: () => import("./locales/gr/messages.po"),
  hi: () => import("./locales/hi/messages.po"),
  id: () => import("./locales/id/messages.po"),
  it: () => import("./locales/it/messages.po"),
  jp: () => import("./locales/jp/messages.po"),
  nl: () => import("./locales/nl/messages.po"),
  pl: () => import("./locales/pl/messages.po"),
  ru: () => import("./locales/ru/messages.po"),
  se: () => import("./locales/se/messages.po"),
  vi: () => import("./locales/vi/messages.po"),
  zh: () => import("./locales/zh/messages.po"),
};

i18n.loadAndActivate({ locale: "en", messages: englishMessages });

const browserLanguageAliases: Readonly<Record<string, Locale>> = {
  el: "gr",
  ja: "jp",
  sv: "se",
};

const isLocale = (locale: string): locale is Locale => SUPPORTED_LOCALES.includes(locale as Locale);

const localeFromLanguageTag = (languageTag: string): Locale | undefined => {
  const language = languageTag.trim().toLowerCase().replaceAll("_", "-").split("-")[0];
  const locale = browserLanguageAliases[language] ?? language;

  return isLocale(locale) ? locale : undefined;
};

export const detectLocale = (): Locale => {
  if (typeof navigator === "undefined") {
    return "en";
  }

  for (const language of navigator.languages) {
    const locale = localeFromLanguageTag(language);
    if (locale) {
      return locale;
    }
  }

  return localeFromLanguageTag(navigator.language) ?? "en";
};

export const activateLocale = async (locale: Locale): Promise<void> => {
  const { messages } = await localeLoaders[locale]();
  i18n.loadAndActivate({ locale, messages });
};

export const useTranslation = (): Translate => {
  const { _ } = useLingui();

  return (id, values) => _(id, values, { message: messageDescriptors[id].message });
};

export { i18n };
