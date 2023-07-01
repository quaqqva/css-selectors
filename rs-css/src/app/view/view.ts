import BaseComponent from '../../components/base-component';
import { LevelData } from '../model/level-data';
import EventEmitter from '../../utils/event-emitter';
import Header from '../../components/header/header';
import footer from '../../components/footer/footer';
import Playground from '../../components/playground (main)/playground';
import SideMenu from '../../components/side-menu/side-menu';

export default class AppView {
  private body: BaseComponent<HTMLElement>;

  private main: Playground;

  private emitter: EventEmitter;

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter;
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

  public loadSideMenu(completedLevels: boolean[], descriptions: string[]) {
    const sideMenu = new SideMenu(this.body, this.emitter, completedLevels, descriptions);
    sideMenu.show();
  }

  public signalWrongInput(): void {
    throw Error('Not implemented');
  }

  public signalWin(): void {
    throw Error('Not implemented');
  }
}
