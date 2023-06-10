import './sources.css';
import findElement from '../../../utils/find-element';

export interface NewsSource {
  id: string;
  name: string;
}

class Sources {
  public draw(data: NewsSource[]): void {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp: HTMLTemplateElement = document.querySelector<HTMLTemplateElement>(
      '#sourceItemTemp'
    ) as HTMLTemplateElement;

    data.forEach((item) => {
      const sourceClone: HTMLElement = sourceItemTemp.content.cloneNode(true) as HTMLElement;

      findElement<HTMLSpanElement>({
        parent: sourceClone,
        selector: '.source__item-name',
        callback: (sourceNameView) => {
          sourceNameView.textContent = item.name;
        },
      });

      findElement<HTMLDivElement>({
        parent: sourceClone,
        selector: '.source__item',
        callback: (sourceItem) => {
          sourceItem.setAttribute('data-source-id', item.id);
        },
      });

      fragment.append(sourceClone);
    });

    findElement<HTMLDivElement>({
      parent: document,
      selector: '.sources',
      callback: (sources) => {
        sources.append(fragment);
      },
    });
  }
}

export default Sources;
