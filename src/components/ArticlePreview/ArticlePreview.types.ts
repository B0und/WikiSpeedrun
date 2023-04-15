export interface ArticlePreview {
  batchcomplete?: string;
  query?: Query;
}

export interface Query {
  pages?: Pages;
}

export interface Pages {
  [pageid: string]: ArticleContent;
}

export interface ArticleContent {
  pageid?: number;
  ns?: number;
  title?: string;
  original?: Image;
  extract?: string;
}

export interface Image {
  source?: string;
  width?: number;
  height?: number;
}
