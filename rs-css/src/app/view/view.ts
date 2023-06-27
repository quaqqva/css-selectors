import BaseComponent from '../../components/base-component';
import { LevelData } from '../../types/level-types';
import EventEmitter from '../../utils/event-emitter';
import Header from '../../components/header/header';
import footer from '../../components/footer/footer';
import Playground from '../../components/playground (main)/playground';

export default class AppView {
  private body: BaseComponent<HTMLElement>;

  private main: Playground;

  public constructor(emitter: EventEmitter) {
    // Create sections
    this.body = BaseComponent.FromElement(document.body);

    const header = new Header();
    this.body.append(header);

    this.main = new Playground(this.body, emitter);

    this.body.append(footer);
  }

  public get SELECTOR_INPUT_EVENT() {
    return Playground.INPUT_EVENT;
  }

  public drawLevel(level: LevelData): void {
    this.main.changeLevel(level);
  }

  public signalWrongInput(): void {
    throw Error('Not implemented');
  }

  public signalWin(): void {
    throw Error('Not implemented');
  }
}
