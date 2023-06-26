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
    this.eventEmitter.subscribe(AppView.INPUT_EVENT, (data) => {
      this.controller.checkInput({
        selector: data,
        sucessCallback: () => {
          this.controller.loadNextLevel((level) => this.view.drawLevel(level));
        },
        failCallback: () => {
          this.view.signalWrongInput();
        },
        winCallback: () => {
          this.view.signalWin();
        },
      });
    });

    this.controller.loadLevel(0, (level) => this.view.drawLevel(level));
  }
}
