import News from './news/news';
import type { Article } from './news/news';
import Sources from './sources/sources';
import { NewsSource } from './sources/sources';

export interface NewsData {
  articles: Article[];
}

export interface SourcesData {
  sources: NewsSource[];
}

export default class AppView {
  private news: News;
  private sources: Sources;
  public constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: Partial<NewsData> | undefined): void {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  public drawSources(data: Partial<SourcesData> | undefined): void {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}
