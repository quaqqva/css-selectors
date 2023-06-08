import { DefaultCallback } from '../../types/default';
import { CompletionState } from '../model/level-data';
import validateSelector from '../../utils/validator';
import EventEmitter from '../../utils/event-emitter';
import AppView from '../view/view';
import LevelStorage from '../model/level-storage/level-storage';
import { AppEvents } from '../../types/app-events';

export default class AppController {
  private emitter: EventEmitter;

  private levelStorage: LevelStorage;

  private view: AppView;

  public constructor(emitter: EventEmitter, view: AppView) {
    this.emitter = emitter;
    this.levelStorage = new LevelStorage();
    this.view = view;

    this.addEventHandlers();
  }

  public get sideMenuData() {
    return [this.levelStorage.completedLevels, this.levelStorage.names];
  }

  public initializeSideMenu(): void {
    this.view.loadSideMenu(this.levelStorage.completedLevels, this.levelStorage.names);
  }

  public loadCurrentLevel(): void {
    this.levelStorage.loadLevel(this.levelStorage.currentLevel, (level) => this.view.drawLevel(level));
  }

  private addEventHandlers(): void {
    this.emitter.subscribe(AppEvents.SelectorInput, (data) => {
      this.checkInput({
        viewData: data,
        sucessCallback: async () => {
          await this.view.signalLevelWin(this.levelStorage.currentSolution);
          this.emitter.emit(AppEvents.LevelCompleted, [this.levelStorage.currentLevel, this.levelStorage.helped]);
          this.levelStorage.loadNextLevel((level) => this.view.drawLevel(level));
        },
        failCallback: () => {
          this.view.signalWrongInput(this.getUserInput(data));
        },
        winCallback: async () => {
          this.emitter.emit(AppEvents.LevelCompleted, [this.levelStorage.currentLevel, this.levelStorage.helped]);
          await this.view.signalLevelWin(this.levelStorage.currentSolution);
          this.view.signalWin();
        },
      });
    });

    this.emitter.subscribe(AppEvents.LevelChoose, (index) =>
      this.levelStorage.loadLevel(index as number, (level) => this.view.drawLevel(level))
    );

    this.emitter.subscribe(AppEvents.ResetProgress, () => {
      this.levelStorage.clearUserData();
      this.levelStorage.loadLevel(this.levelStorage.currentLevel, (level) => this.view.drawLevel(level));
    });

    this.emitter.subscribe(AppEvents.GetSelector, () => {
      this.emitter.emit(AppEvents.PostSelector, this.levelStorage.help);
    });
  }

  private checkInput({
    viewData,
    sucessCallback,
    failCallback,
    winCallback,
  }: {
    viewData: unknown;
    sucessCallback: DefaultCallback;
    failCallback: DefaultCallback;
    winCallback: DefaultCallback;
  }): void {
    const [markup, selector] = viewData as [markup: string, selector: string];
    const isValid = validateSelector({ markup, selector, solution: this.levelStorage.currentSolution });
    if (isValid) {
      this.levelStorage.levelCompletionState = this.levelStorage.helped
        ? CompletionState.CompletedWithHelp
        : CompletionState.Completed;
      this.levelStorage.saveUserData();
      if (this.levelStorage.currentLevel === this.levelStorage.levelsCount - 1) winCallback();
      else sucessCallback();
    } else failCallback();
  }

  private getUserInput(viewData: unknown) {
    const selector = (viewData as [markup: string, selector: string])[1];
    return selector;
  }
}
