import BaseComponent from '../base-component';
import TableItem from './table-item';

export default class Table extends BaseComponent<HTMLDivElement> {
  private items: TableItem[];

  public constructor(parent: Node | BaseComponent<HTMLElement>) {
    super({ classes: ['table'], parent });
    this.items = [];
  }

  public getTableMarkup(): string {
    return this.items.reduce((cummulative, currentItem) => cummulative + currentItem.getMarkup(), '');
  }

  public override append(...elements: TableItem[]): void {
    super.append(...elements);
    this.items.push(...elements);
  }
}
