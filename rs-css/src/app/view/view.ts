import BaseComponent from '../../components/base-component';
import { CompletionState, NumeratedLevel } from '../model/level-data';
import EventEmitter from '../../utils/event-emitter';
import Header from '../../components/header/header';
import footer from '../../components/footer/footer';
import Playground from '../../components/playground (main)/playground';
import SideMenu from '../../components/side-menu/side-menu';

export default class AppView {
  private body: BaseComponent<HTMLElement>;

  private header: Header;

  private main: Playground;

  private sideMenu?: SideMenu;

  private emitter: EventEmitter;

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    // Create sections
    this.body = BaseComponent.FromElement(document.body);

    this.header = new Header();
    this.body.append(this.header);

    this.main = new Playground({ parent: this.body, emitter });

    this.body.append(footer);
  }

  public get SELECTOR_INPUT_EVENT() {
    return Playground.INPUT_EVENT;
  }

  public get LEVEL_CHOOSE_EVENT() {
    return SideMenu.LEVEL_CHOSEN;
  }

  public drawLevel(level: NumeratedLevel): void {
    this.main.changeLevel(level);
    if (this.sideMenu) this.sideMenu.loadLevel(level);
  }

  public loadSideMenu(completedLevels: CompletionState[], names: string[]) {
    this.sideMenu = new SideMenu(this.body, this.emitter, completedLevels, names);
    this.header.addMenuButton(this.sideMenu);
    this.sideMenu.show();
  }

  public signalWrongInput(): void {
    throw Error('Not implemented');
  }

  public signalWin(): void {
    throw Error('Not implemented');
  }
}
