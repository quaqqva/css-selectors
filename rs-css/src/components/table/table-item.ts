import BaseComponent from '../base-component';
import { ElementParameters } from '../../types/default';
import { TableItemData, TableItemMarkup } from '../../types/level-types';

export default class TableItem extends BaseComponent<HTMLDivElement> {
  private children: TableItemMarkup[];

  private fakeMarkupParams: TableItemMarkup;

  public constructor(markup: Partial<ElementParameters>, fakeMarkup: TableItemData) {
    super(markup);
    this.fakeMarkupParams = fakeMarkup;
    this.children = [];
  }

  public getMarkup(): BaseComponent<HTMLSpanElement> {
    const fakeComponent = new BaseComponent(this.fakeMarkupParams);
    const markupText: string = fakeComponent.HTML;
    return new BaseComponent<HTMLSpanElement>({ tag: 'span', textContent: markupText });
  }

  public override append(...elements: TableItem[]): void {
    super.append(...elements);
    this.children.push(...elements.map((element) => element.fakeMarkupParams));
  }
}
