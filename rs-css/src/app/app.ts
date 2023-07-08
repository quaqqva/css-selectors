import { AppEvents } from '../types/app-events';
import EventEmitter from '../utils/event-emitter';
import AppController from './controller/controller';
import AppView from './view/view';

export default class App {
  private controller: AppController;

  private view: AppView;

  private eventEmitter: EventEmitter;

  public constructor() {
    this.eventEmitter = new EventEmitter();

    this.controller = new AppController();
    this.view = new AppView(this.eventEmitter);
  }

  public start(): void {
    this.eventEmitter.subscribe(this.view.SELECTOR_INPUT_EVENT, (data) => {
      this.controller.checkInput({
        viewData: data,
        sucessCallback: async () => {
          await this.view.signalLevelWin(this.controller.currentSolution);
          this.eventEmitter.emit(AppEvents.LevelCompleted, [this.controller.currentLevel, this.controller.helped]);
          this.controller.loadNextLevel((level) => this.view.drawLevel(level));
        },
        failCallback: () => {
          this.view.signalWrongInput(this.controller.getUserInput(data));
        },
        winCallback: async () => {
          this.eventEmitter.emit(AppEvents.LevelCompleted, [this.controller.currentLevel, this.controller.helped]);
          await this.view.signalLevelWin(this.controller.currentSolution);
          this.view.signalWin();
        },
      });
    });

    this.eventEmitter.subscribe(this.view.LEVEL_CHOOSE_EVENT, (index) =>
      this.controller.loadLevel(index as number, (level) => this.view.drawLevel(level))
    );

    this.eventEmitter.subscribe(AppEvents.ResetProgress, () => {
      this.controller.clearUserData();
      this.controller.loadLevel(this.controller.currentLevel, (level) => this.view.drawLevel(level));
    });

    this.eventEmitter.subscribe(AppEvents.GetSelector, () => {
      this.eventEmitter.emit(AppEvents.PostSelector, this.controller.help);
    });

    this.view.loadSideMenu(this.controller.completedLevels, this.controller.names);
    this.controller.loadLevel(this.controller.currentLevel, (level) => this.view.drawLevel(level));
  }
}
