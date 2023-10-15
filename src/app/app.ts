import EventEmitter from '../utils/event-emitter';
import AppController from './controller/controller';
import AppView from './view/view';

export default class App {
  private controller: AppController;

  private view: AppView;

  private eventEmitter: EventEmitter;

  public constructor() {
    this.eventEmitter = new EventEmitter();

    this.view = new AppView(this.eventEmitter);
    this.controller = new AppController(this.eventEmitter, this.view);
  }

  public start(): void {
    this.controller.initializeSideMenu();
    this.controller.loadCurrentLevel();
  }
}
