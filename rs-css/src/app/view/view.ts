import BaseComponent from '../../components/base-component';
import Table from '../../components/table/table';
import TableItem from '../../components/table/table-item';
import { ElementParameters } from '../../types/default';
import { LevelData } from '../../types/level-types';
import CSSInput from '../../components/css-input/css-input';
import EventEmitter from '../../utils/event-emitter';
import Header from '../../components/header/header';
import footer from '../../components/footer/footer';

export default class AppView {
  public static INPUT_EVENT = 'selector-input';

  private body: BaseComponent<HTMLElement>;

  private taskHeader: BaseComponent<HTMLHeadingElement>;

  private cssInput: CSSInput;

  private table: Table;

  public constructor(emitter: EventEmitter) {
    // Create sections and Load components
    this.body = BaseComponent.FromElement(document.body);

    const header = new Header();
    this.body.append(header);

    const main = new BaseComponent<HTMLElement>({ tag: 'main', parent: this.body });
    this.taskHeader = new BaseComponent<HTMLHeadingElement>({ tag: 'h2', classes: ['level-task'], parent: main });
    this.table = new Table(main);

    this.cssInput = new CSSInput(main);
    this.cssInput.addEventListener('input', () => {
      emitter.emit(AppView.INPUT_EVENT, this.cssInput.text);
    });

    this.body.append(footer);
  }

  public drawLevel(level: LevelData): void {
    this.taskHeader.textContent = level.task;
    level.tableItems.forEach((tableItem) => {
      const classes = structuredClone(tableItem.classes);
      classes?.push(tableItem.tag);
      if (tableItem.id) classes?.push(tableItem.id);
      const markup: Partial<ElementParameters> = {
        tag: 'div',
        classes,
        attributes: tableItem.attributes,
      };
      const item = new TableItem(markup, tableItem);
      this.table.append(item);
    });
  }

  public signalWrongInput(): void {
    throw Error('Not implemented');
  }

  public signalWin(): void {
    throw Error('Not implemented');
  }
}
