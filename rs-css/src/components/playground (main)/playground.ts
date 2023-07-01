import { ElementParameters } from '../../types/default';
import { LevelData } from '../../app/model/level-data';
import { Tags, Events } from '../../types/dom-types';
import EventEmitter from '../../utils/event-emitter';
import BaseComponent from '../base-component';
import CSSInput from '../css-input/css-input';
import Table from '../table/table';
import TableItem from '../table/table-item';
import './playground-styles.scss';

enum PlaygroundClasses {
  Playground = 'playground',
  TaskHeading = 'playground__task',
}

export default class Playground extends BaseComponent<HTMLElement> {
  private static ELEMENT_PARAMS = {
    tag: Tags.Main,
    classes: [PlaygroundClasses.Playground],
  };

  private static HEADING_PARAMS = {
    tag: Tags.Heading2,
    classes: [PlaygroundClasses.TaskHeading],
  };

  public static INPUT_EVENT = 'selector-input';

  private taskHeader: BaseComponent<HTMLHeadingElement>;
  private table: Table;
  private cssInput: CSSInput;

  public constructor(parent: BaseComponent<HTMLElement>, emitter: EventEmitter) {
    super({ ...Playground.ELEMENT_PARAMS, parent });
    this.taskHeader = new BaseComponent<HTMLHeadingElement>({ ...Playground.HEADING_PARAMS, parent: this });
    this.table = new Table(this);
    this.cssInput = new CSSInput(this);

    this.cssInput.addEventListener(Events.Input, () => {
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
        tag: Tags.Div,
        classes,
        attributes: tableItem.attributes,
      };
      const item = new TableItem(markup, tableItem);
      this.table.append(item);
    });
  }
}
