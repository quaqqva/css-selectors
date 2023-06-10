import News from './news/news';
import type { Article } from './news/news';
import Sources from './sources/sources';
import { NewsSource } from './sources/sources';

interface NewsData {
  articles: Article[];
}

interface SourcesData {
  sources: NewsSource[];
}

export default class AppView {
  news: News;
  sources: Sources;
  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  drawNews(data: NewsData) {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  drawSources(data: SourcesData) {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}
