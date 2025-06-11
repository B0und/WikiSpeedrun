export interface WikiApiArticle {
  parse?: Parse;
}

export interface Parse {
  title?: Title;
  pageid?: number;
  revid?: number;
  // biome-ignore lint/suspicious/noExplicitAny: a
  redirects?: any[];
  text?: Text;
  langlinks?: Langlink[];
  categories?: Category[];
  links?: Link[];
  templates?: Link[];
  images?: string[];
  externallinks?: string[];
  sections?: Section[];
  showtoc?: string;
  parsewarnings?: string[];
  displaytitle?: string;
  iwlinks?: Iwlink[];
  properties?: Property[];
}

export interface Category {
  sortkey?: Title;
  hidden?: string;
  "*"?: string;
}

export type Title = string;

export interface Iwlink {
  prefix?: string;
  url?: string;
  "*"?: string;
}

export interface Langlink {
  lang?: string;
  url?: string;
  langname?: string;
  autonym?: string;
  "*"?: string;
}

export interface Link {
  ns?: number;
  exists?: string;
  "*"?: string;
}

export interface Property {
  name?: string;
  "*"?: string;
}

export interface Section {
  toclevel?: number;
  level?: string;
  line?: string;
  number?: string;
  index?: string;
  fromtitle?: Fromtitle;
  byteoffset?: number;
  anchor?: string;
  linkAnchor?: string;
}

export type Fromtitle = string;

export interface Text {
  "*"?: string;
}
