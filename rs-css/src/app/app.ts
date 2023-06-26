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

    this.eventEmitter.subscribe(AppView.INPUT_EVENT, (data) => {
      this.controller.validateSelector(
        data,
        () => {
          this.controller.loadLevel(this.controller.levelIndex + 1, (level) => this.view.drawLevel(level));
        },
        () => {
          this.view.signalWrongInput();
        }
      );
    });
  }

  public start(): void {
    this.controller.loadLevel(0, (level) => this.view.drawLevel(level));
  }
}
