import './sources.scss';
import findElement from '../../../utils/find-element';
import BurgerMenu from '../../burger-menu/burger-menu';

export interface NewsSource {
  id: string;
  name: string;
}

class Sources {
  private sourcesMenu: BurgerMenu;
  public constructor() {
    this.sourcesMenu = new BurgerMenu();
  }

  public draw(data: NewsSource[], mobileQuery: MediaQueryList): void {
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
          if (mobileQuery.matches) {
            sourceItem.addEventListener('click', () => {
              this.sourcesMenu.hideMenu();
            });
          }
        },
      });

      fragment.append(sourceClone);
    });

    if (mobileQuery.matches) {
      this.sourcesMenu.clearElements();
      const sourcesWrapper = document.createElement('div');
      sourcesWrapper.classList.add('sources-wrapper');
      sourcesWrapper.classList.add('sources-wrapper_modal');

      const sourcesContainer = document.createElement('div');
      sourcesContainer.classList.add('sources');
      sourcesContainer.classList.add('sources_modal');
      sourcesContainer.append(fragment);

      sourcesWrapper.append(sourcesContainer);
      this.sourcesMenu.addElement(sourcesWrapper);
    } else {
      this.sourcesMenu.hideMenu();
      findElement<HTMLDivElement>({
        parent: document,
        selector: '.sources',
        callback: (sources) => {
          sources.append(fragment);
        },
      });
    }
  }
}

export default Sources;
