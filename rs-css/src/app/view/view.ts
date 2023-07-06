import BaseComponent from '../../components/base-component';
import { CompletionState, NumeratedLevel } from '../model/level-data';
import EventEmitter from '../../utils/event-emitter';
import Header from '../../components/header/header';
import footer from '../../components/footer/footer';
import Playground from '../../components/playground (main)/playground';
import SideMenu from '../../components/side-menu/side-menu';
import { AnimationParams } from '../../types/dom-types';

export default class AppView {
  private body: BaseComponent<HTMLElement>;

  private header: Header;

  private main: Playground;

  private sideMenu?: SideMenu;

  private emitter: EventEmitter;

  private static LOSE_ANIMATION_PARAMS: AnimationParams = {
    name: 'lose',
    duration: 500,
    repeatCount: 3,
  };

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

  public async signalLevelWin(selector: string) {
    await this.main.animate(selector, Playground.WIN_ANIMATION_PARAMS);
  }

  public async signalWrongInput(input: string) {
    this.main.animateCSSInput(AppView.LOSE_ANIMATION_PARAMS);
    await this.main.animate(input, AppView.LOSE_ANIMATION_PARAMS);
  }

  public signalWin(): void {
    this.main.signalWin();
    this.sideMenu?.showWinText();
  }
}
