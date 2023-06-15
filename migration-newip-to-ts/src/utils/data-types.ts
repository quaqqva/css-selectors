export interface ArticleSource {
  name: string;
}

export type Article = {
  author: string;
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  url: string;
  source: ArticleSource;
};

export interface NewsSource {
  id: string;
  name: string;
}

export interface NewsData {
  articles: Article[];
}

export interface SourcesData {
  sources: NewsSource[];
}
