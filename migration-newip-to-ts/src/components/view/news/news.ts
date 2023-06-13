import './news.css';
import findElement from '../../../utils/find-element';
import placeholderPath from '../../../img/img-placeholder.png';

export type Article = {
  author: string;
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  url: string;
  source: ArticleSource;
};

interface ArticleSource {
  name: string;
}

export default class News {
  public draw(data: Article[]): void {
    const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

    const fragment: DocumentFragment = document.createDocumentFragment();
    const newsItemTemp: HTMLTemplateElement = document.querySelector('#newsItemTemp') as HTMLTemplateElement;

    news.forEach((item, idx) => {
      const newsClone: HTMLElement = newsItemTemp.content.cloneNode(true) as HTMLElement;

      if (idx % 2) {
        findElement<HTMLDivElement>({
          parent: newsClone,
          selector: '.news__item',
          callback: (newsItem) => {
            newsItem.classList.add('alt');
          },
        });
      }

      findElement<HTMLDivElement>({
        parent: newsClone,
        selector: '.news__meta-photo',
        callback: (photo) => {
          photo.style.backgroundImage = `url(${item.urlToImage || placeholderPath})`;
        },
      });

      findElement<HTMLElement>({
        parent: newsClone,
        selector: '.news__meta-author',
        callback: (authorView) => {
          authorView.textContent = item.author || item.source.name;
        },
      });

      findElement<HTMLElement>({
        parent: newsClone,
        selector: '.news__meta-date',
        callback: (dateView) => {
          dateView.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');
        },
      });

      findElement<HTMLHeadingElement>({
        parent: newsClone,
        selector: '.news__description-title',
        callback: (titleView) => {
          titleView.textContent = item.title;
        },
      });

      findElement<HTMLHeadingElement>({
        parent: newsClone,
        selector: '.news__description-source',
        callback: (sourceView) => {
          sourceView.textContent = item.source.name;
        },
      });

      findElement<HTMLParagraphElement>({
        parent: newsClone,
        selector: '.news__description-content',
        callback: (contentView) => {
          contentView.textContent = item.description;
        },
      });

      findElement<HTMLAnchorElement>({
        parent: newsClone,
        selector: '.news__read-more a',
        callback: (readMoreLink) => {
          readMoreLink.setAttribute('href', item.url);
        },
      });

      fragment.append(newsClone);
    });

    findElement<HTMLDivElement>({
      parent: document,
      selector: '.news',
      callback: (newsWrapper) => {
        newsWrapper.innerHTML = '';
        newsWrapper.appendChild(fragment);
      },
    });
  }
}
