import { ElementParameters } from '../../types/default';
import { LevelData } from '../../types/level-types';
import EventEmitter from '../../utils/event-emitter';
import BaseComponent from '../base-component';
import CSSInput from '../css-input/css-input';
import Table from '../table/table';
import TableItem from '../table/table-item';

export default class Playground extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: 'main',
    classes: ['playground'],
  };

  public static INPUT_EVENT = 'selector-input';

  private taskHeader: BaseComponent<HTMLHeadingElement>;
  private table: Table;
  private cssInput: CSSInput;

  public constructor(parent: BaseComponent<HTMLElement>, emitter: EventEmitter) {
    super({ ...Playground.ELEMENT_PARAMS, parent });
    this.taskHeader = new BaseComponent<HTMLHeadingElement>({ tag: 'h2', classes: ['playground-task'], parent: this });
    this.table = new Table(this);
    this.cssInput = new CSSInput(this);

    this.cssInput.addEventListener('input', () => {
      emitter.emit(Playground.INPUT_EVENT, this.cssInput.text);
    });
  }

  public changeLevel(level: LevelData) {
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
}
