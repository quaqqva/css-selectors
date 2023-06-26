import BaseComponent from '../base-component';
import TableItem from './table-item';

export default class Table extends BaseComponent<HTMLDivElement> {
  private items: TableItem[];

  public constructor(parent: Node | BaseComponent<HTMLElement>) {
    super({ classes: ['table'], parent });
    this.items = [];
  }

  public getTableMarkup(): BaseComponent<HTMLDivElement> {
    const markupContainer = new BaseComponent<HTMLDivElement>({ classes: ['table-markup'] });
    markupContainer.append(...this.items.map((item) => item.getMarkup()));
    return markupContainer;
  }

  public override append(...elements: TableItem[]): void {
    super.append(...elements);
    this.items.push(...elements);
  }
}
