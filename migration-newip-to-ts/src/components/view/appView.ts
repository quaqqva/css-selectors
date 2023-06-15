import News from './news/news';
import { NewsData, SourcesData } from '../../utils/data-types';
import Sources from './sources/sources';

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
    const mobileQuery: MediaQueryList = window.matchMedia('(max-width: 500px)');
    mobileQuery.addEventListener('change', this.sources.draw.bind(this.sources, values, mobileQuery));
    this.sources.draw(values, mobileQuery);
  }
}
