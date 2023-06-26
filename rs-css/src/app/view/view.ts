import BaseComponent from '../../components/base-component';
import Table from '../../components/table/table';
import TableItem from '../../components/table/table-item';
import { ElementParameters } from '../../types/default';
import { LevelData } from '../../types/level-types';
import CSSInput from '../../components/css-input/css-input';
import EventEmitter from '../../utils/event-emitter';

export default class AppView {
  public static INPUT_EVENT = 'selector-input';

  private main: BaseComponent<HTMLElement>;

  private taskHeader: BaseComponent<HTMLHeadingElement>;

  private cssInput: CSSInput;

  private table: Table;

  public constructor(emitter: EventEmitter) {
    // Load components
    this.main = new BaseComponent<HTMLElement>({ tag: 'main', parent: document.body });
    this.taskHeader = new BaseComponent<HTMLHeadingElement>({ tag: 'h2', classes: ['level-task'], parent: this.main });
    this.table = new Table(this.main);

    this.cssInput = new CSSInput(this.main);
    this.cssInput.addEventListener('input', () => {
      emitter.emit(AppView.INPUT_EVENT, this.cssInput.text);
    });
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
        parent: this.table,
      };
      const item = new TableItem(markup, tableItem);
    });
  }

  public signalWrongInput(): void {

  }
}
