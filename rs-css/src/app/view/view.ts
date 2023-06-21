import BaseComponent from '../../components/base-component';
import Table from '../../components/table/table';
import { LevelData } from '../../types/level-types';

export default class AppView {
  public static INPUT_EVENT = 'selector_input';

  private main: BaseComponent<HTMLElement>;

  private table: Table;

  public constructor() {
    this.main = new BaseComponent<HTMLElement>({ tag: 'main', parent: document.body });
    this.table = new Table(this.main);
  }

  public drawLevel(level: LevelData): void {
    throw Error('Not implemented');
  }
}
