export interface WikiRandom {
  continue?: Continue;
  query?: Query;
}

export interface Continue {
  lhcontinue?: string;
  grncontinue?: string;
  continue?: string;
}

export interface Query {
  pages?: { [key: string]: Page };
}

export interface Page {
  pageid: number;
  ns?: number;
  title: string;
  linkshere?: Linkshere[];
}

export interface Linkshere {
  pageid?: number;
}
